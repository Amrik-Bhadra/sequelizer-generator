const db = require("../config/db")
const deleteRelationship = require("./deleteRelationship");

async function updateModelAssociation(userId, modelName, targetModel, type, foreignKey, as) {
    const [rows] = await db.execute(
        `SELECT * FROM models WHERE user_id = ? AND name = ?`,
        [userId, modelName]
    );

    if (rows.length === 0) {
        console.warn(`Model not found: ${modelName}`);
        return;
    }

    const model = rows[0];
    let code = model.code;
    const metadata = typeof model.metadata === 'string'
        ? JSON.parse(model.metadata)
        : model.metadata;

    let association;
    const [modelA, modelB] = [modelName, targetModel].sort();
    const throughTable = `${modelA}_${modelB}`;

    if (type === 'belongsToMany') {
        if (!as) {
            association = `${modelName}.${type}(models.${targetModel}, { foreignKey: '${foreignKey}', through: '${throughTable}' });`;
        } else {
            association = `${modelName}.${type}(models.${targetModel}, { foreignKey: '${foreignKey}', through: '${throughTable}', as: '${as}' });`;
        }
    } else {
        if (!as) {
            association = `${modelName}.${type}(models.${targetModel}, { foreignKey: '${foreignKey}' });`;
        } else {
            association = `${modelName}.${type}(models.${targetModel}, { foreignKey: '${foreignKey}', as: '${as}' });`;
        }
    }

    // console.log(`Adding association: ${association}`);
    if (code.includes("static associate(models)")) {
        code = code.replace(
            /static associate\(models\) \{([\s\S]*?)\n\s*\}/,
            (match, inner) => {
                const lines = inner.trim().split('\n').map(line => line.trim()).filter(Boolean);

                if (!lines.includes(association)) {
                    lines.push(association);
                }

                const newInner = lines.map(line => `  ${line}`).join('\n');

                return `static associate(models) {\n${newInner}\n  }`;
            }
        );
    } else {
        code = code.replace(
            new RegExp(`class\\s+${modelName}\\s+extends\\s+Model\\s+\\{`),
            (match) => `${match}\n  static associate(models) {\n    ${association}\n  }`
        );
    }

    if (!metadata.associations) {
        metadata.associations = [];
    }
    const exists = metadata.associations.some(
        (a) => a.type === type && a.target === targetModel && a.foreignKey === foreignKey && a.as === (as || null)
    );
    if (!exists) {
        if (type === 'belongsToMany') {
            metadata.associations.push({
                type: type,
                target: targetModel,
                foreignKey: foreignKey,
                through: throughTable,
                as: as || null
            });
        }else{
            metadata.associations.push({
                type: type,
                target: targetModel,
                foreignKey: foreignKey,
                as: as || null
            });
        }
    }

    const metadataString = JSON.stringify(metadata);

    await db.execute(
        `UPDATE models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
        [code, metadataString, userId, modelName]
    );

    // console.log(`Updated ${modelName}: added ${type}(${targetModel})`);
}

module.exports = {
    updateModelAssociation
}