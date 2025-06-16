const generateAssociationCode = (sourceModel, targetModel, associationType, foreignKey, throughModel, asValue, modelCodes, setGeneratedCode) => {
    if (!sourceModel || !targetModel || !associationType) {
        setGeneratedCode({
            sourceCode: "// Please select the models",
            targetCode: "// Please select the models",
        });
        return;
    }

    let forwardMethod, reverseMethod;

    switch (associationType) {
        case "one-to-one":
            forwardMethod = "hasOne";
            reverseMethod = "belongsTo";
            break;
        case "one-to-many":
            forwardMethod = "hasMany";
            reverseMethod = "belongsTo";
            break;
        case "many-to-many":
            forwardMethod = "belongsToMany";
            reverseMethod = "belongsToMany";
            break;
        default:
            throw new Error(`Unknown relationship type: ${associationType}`);
    }

    const buildOptions = (isReverse = false) => {
        const opts = [];
        if (foreignKey) opts.push(`foreignKey: "${foreignKey}"`);
        if (throughModel && forwardMethod === "belongsToMany") {
            opts.push(`through: "${throughModel}"`);
        }
        if (asValue && !isReverse) {
            opts.push(`as: "${asValue}"`);
        }
        return opts.length > 0 ? `, \n\t\t{ ${opts.join(", ")} }` : "";
    };

    const forwardLine = `${sourceModel}.${forwardMethod}(models.${targetModel}${buildOptions(
        false
    )});`;
    const reverseLine = `${targetModel}.${reverseMethod}(models.${sourceModel}${buildOptions(
        true
    )});`;

    const updateModelCode = (modelName, relationLine) => {
        let baseCode = modelCodes[modelName] || "";

        if (baseCode.includes("static associate(models)")) {
            baseCode = baseCode.replace(
                /static associate\(models\) \{([\s\S]*?)\n\s*\}/,
                (match, inner) => {
                    const lines = inner
                        .trim()
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean);

                    if (!lines.includes(relationLine)) {
                        lines.push(relationLine);
                    }

                    const newInner = lines.map((line) => `    ${line}`).join("\n");
                    return `static associate(models) {\n${newInner}\n  }`;
                }
            );
        } else {
            const classRegex = new RegExp(
                `class\\s+${modelName}\\s+extends\\s+Model\\s*\\{`
            );
            const match = baseCode.match(classRegex);

            if (match) {
                baseCode = baseCode.replace(
                    classRegex,
                    `${match[0]}\n  static associate(models) {\n    ${relationLine}\n  }`
                );
            } else {
                baseCode += `\n\nstatic associate(models) {\n    ${relationLine}\n  }\n`;
            }
        }

        return baseCode;
    };

    const sourceUpdatedCode = updateModelCode(sourceModel, forwardLine);
    const targetUpdatedCode = updateModelCode(targetModel, reverseLine);

    setGeneratedCode({
        sourceCode: sourceUpdatedCode,
        targetCode: targetUpdatedCode,
    });
};

const generateEditAssociationCode = (metadata,
    sourceModel,
    targetModel,
    associationType,
    foreignKey,
    throughModel,
    asValue, setGeneratedCode) => {
    if (
        !sourceModel ||
        !targetModel ||
        !associationType ||
        !metadata[sourceModel] ||
        !metadata[targetModel]
    ) {
        setGeneratedCode({
            sourceCode: "// Please select valid models",
            targetCode: "// Please select valid models",
        });
        return;
    }

    let forwardMethod, reverseMethod;
    switch (associationType) {
        case "one-to-one":
            forwardMethod = "hasOne";
            reverseMethod = "belongsTo";
            break;
        case "one-to-many":
            forwardMethod = "hasMany";
            reverseMethod = "belongsTo";
            break;
        case "many-to-many":
            forwardMethod = "belongsToMany";
            reverseMethod = "belongsToMany";
            break;
        default:
            throw new Error(`Unknown relationship type: ${associationType}`);
    }

    const buildOptions = (isReverse = false) => {
        const opts = [];
        if (foreignKey) opts.push(`foreignKey: "${foreignKey}"`);
        if (throughModel && forwardMethod === "belongsToMany") {
            opts.push(`through: "${throughModel}"`);
        }
        if (asValue && !isReverse) {
            opts.push(`as: "${asValue}"`);
        }
        return opts.length ? `, { ${opts.join(", ")} }` : "";
    };

    const forwardLine = `${sourceModel}.${forwardMethod}(models.${targetModel}${buildOptions(
        false
    )});`;
    const reverseLine = `${targetModel}.${reverseMethod}(models.${sourceModel}${buildOptions(
        true
    )});`;

    const toSequelizeMethod = (assoc) => {
        if (
            ["belongsTo", "hasMany", "hasOne", "belongsToMany"].includes(assoc.type)
        )
            return assoc.type;

        switch (assoc.type) {
            case "one-to-one":
                return assoc.owner ? "hasOne" : "belongsTo";
            case "one-to-many":
                return assoc.owner ? "hasMany" : "belongsTo";
            case "many-to-many":
                return "belongsToMany";
            default:
                throw new Error(`Unrecognised association type: ${assoc.type}`);
        }
    };

    const assocToCodeLine = (modelName, assoc) => {
        const method = toSequelizeMethod(assoc);
        const opts = [];
        if (assoc.foreignKey) opts.push(`foreignKey: "${assoc.foreignKey}"`);
        if (assoc.through && method === "belongsToMany")
            opts.push(`through: "${assoc.through}"`);
        if (assoc.as) opts.push(`as: "${assoc.as}"`);
        const optionsStr = opts.length ? `, { ${opts.join(", ")} }` : "";
        return `    ${modelName}.${method}(models.${assoc.target}${optionsStr});`;
    };

    const buildModelCode = (
        modelName,
        otherModel,
        modelMeta,
        mainAssociationLine
    ) => {
        const fields = modelMeta.fields || [];
        let attrString = "";

        for (const field of fields) {
            let sequelizeType;
            switch (field.type?.toLowerCase()) {
                case "string":
                    sequelizeType = "DataTypes.STRING";
                    break;
                case "number":
                    sequelizeType = "DataTypes.INTEGER";
                    break;
                case "boolean":
                    sequelizeType = "DataTypes.BOOLEAN";
                    break;
                case "date":
                    sequelizeType = "DataTypes.DATE";
                    break;
                case "array":
                    const base = (field.arrayType || "string").toLowerCase();
                    const map = {
                        string: "DataTypes.STRING",
                        number: "DataTypes.INTEGER",
                        boolean: "DataTypes.BOOLEAN",
                        date: "DataTypes.DATE",
                        object: "DataTypes.JSON",
                        uuid: "DataTypes.UUID",
                    };
                    sequelizeType = `DataTypes.ARRAY(${map[base] || "DataTypes.STRING"
                        })`;
                    break;
                case "object":
                    sequelizeType = "DataTypes.JSON";
                    break;
                case "objectid":
                    sequelizeType = "DataTypes.UUID";
                    break;
                default:
                    sequelizeType = "DataTypes.STRING";
            }

            let line = `    ${field.name}: {\n      type: ${sequelizeType}`;
            if (field.allowNull !== true && field.allowNull !== "Yes")
                line += ",\n      allowNull: false";
            if (field.primaryKey === "Yes") line += ",\n      primaryKey: true";
            if (field.autoIncrement === true || field.autoIncrement === "Yes")
                line += ",\n      autoIncrement: true";
            if (field.unique === "Yes") line += ",\n      unique: true";
            if (field.defaultValue && field.defaultValue !== "")
                line += `,\n      defaultValue: ${JSON.stringify(
                    field.defaultValue
                )}`;
            line += "\n    },\n";
            attrString += line;
        }

        const associations = modelMeta.associations || [];

        const otherAssociations = associations
            .filter((assoc) => {
                const touchesEditedPair =
                    (modelName === sourceModel && assoc.target === targetModel) ||
                    (modelName === targetModel && assoc.target === sourceModel);
                return !touchesEditedPair;
            })
            .map((assoc) => assocToCodeLine(modelName, assoc))
            .filter(Boolean);

        if (mainAssociationLine)
            otherAssociations.push(`    ${mainAssociationLine}`);

        const associateBlock = otherAssociations.length
            ? `  static associate(models) {\n${otherAssociations.join("\n")}\n  }\n`
            : "";

        return (
            `const { Model, DataTypes } = require('sequelize');\n` +
            `const sequelize = require('../config/db');\n\n` +
            `class ${modelName} extends Model {\n${associateBlock}}\n\n` +
            `${modelName}.init({\n${attrString}}, {\n` +
            `  sequelize,\n  modelName: '${modelName}',\n  tableName: '${modelName.toLowerCase()}s',\n  timestamps: false\n});\n\n` +
            `module.exports = ${modelName};\n`
        );
    };

    const sourceCode = buildModelCode(
        sourceModel,
        targetModel,
        metadata[sourceModel],
        forwardLine
    );
    const targetCode = buildModelCode(
        targetModel,
        sourceModel,
        metadata[targetModel],
        reverseLine
    );

    setGeneratedCode({ sourceCode, targetCode });
};

export { generateAssociationCode, generateEditAssociationCode };