// models.controller.js

const db = require('../config/db');

// SQL Helpers
const getModelById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM models WHERE id = ?`, [id]);
  return rows[0]; // always return single object
};

const insertModel = async (name, code, metadata, userId) => {
  const [result] = await db.execute(
    `INSERT INTO models (name, code, metadata, user_id) VALUES (?, ?, ?, ?)`,
    [name, code, JSON.stringify(metadata), userId]
  );
  return result;
};

const updateModelCode = async (id, newName, regeneratedCode, updatedMetadata) => {
  const [result] = await db.execute(
    `UPDATE models SET name = ?, code = ?, metadata = ? WHERE id = ?`,
    [newName, regeneratedCode, JSON.stringify(updatedMetadata), id]
  );
  return result;
};

const getModelByNameAndUser = async (name, userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM models WHERE name = ? AND user_id = ?`,
    [name, userId]
  );
  return rows[0];
};

const getAllModelsForUser = async (userId) => {
  const [rows] = await db.execute(`SELECT * FROM models WHERE user_id = ?`, [userId]);
  return rows;
};

const deleteModelById = async (id) => {
  const [result] = await db.execute(`DELETE FROM models WHERE id = ?`, [id]);
  return result;
};

// Generate model code
const generateModelCode = (modelName, fields) => {
  let attrString = '';
  for (const [key, options] of Object.entries(fields)) {
    let sequelizeType;
    // switch (options.type.toLowerCase()) {
    //   case "string":
    //     sequelizeType = "DataTypes.STRING";
    //     break;
    //   case "number":
    //     sequelizeType = "DataTypes.INTEGER";
    //     break;
    //   case "boolean":
    //     sequelizeType = "DataTypes.BOOLEAN";
    //     break;
    //   case "date":
    //     sequelizeType = "DataTypes.DATE";
    //     break;
    //   case "array":
    //     const base = (options.arrayType || "string").toLowerCase();
    //     const map = {
    //       string: "DataTypes.STRING",
    //       number: "DataTypes.INTEGER",
    //       boolean: "DataTypes.BOOLEAN",
    //       date: "DataTypes.DATE",
    //       object: "DataTypes.JSON",
    //       uuid: "DataTypes.UUID",
    //     };
    //     sequelizeType = `DataTypes.ARRAY(${map[base] || "DataTypes.STRING"})`;
    //     break;
    //   case "object":
    //     sequelizeType = "DataTypes.JSON";
    //     break;
    //   case "uuid":
    //     sequelizeType = "DataTypes.UUID";
    //     break;
    //   default:
    //     sequelizeType = "DataTypes.STRING";
    // }
    if(options.type === "ARRAY"){
      sequelizeType = `DataTypes.ARRAY(DataTypes.${options.arrayType})`;
    }else{
      sequelizeType = `DataTypes.${options.type}`;
    }
    let line = `    ${options.name}: {\n      type: ${sequelizeType}`;
    if (options.allowNull !== true && options.allowNull !== "Yes")
      line += ",\n      allowNull: false";
    if (options.primaryKey === "Yes") line += ",\n      primaryKey: true";
    if (options.autoIncrement === true || options.autoIncrement === "Yes")
      line += ",\n      autoIncrement: true";
    if (options.unique === "Yes") line += ",\n      unique: true";
    if (options.defaultValue && options.defaultValue !== "")
      line += `,\n      defaultValue: ${JSON.stringify(options.defaultValue)}`;

    if (options.validate && options.validate !== "none") {
      line += ",\n      validate: {\n";
      if (options.validate === "len") {
        const min = options.validateArgs?.min || 0;
        const max = options.validateArgs?.max || 255;
        line += `        len: [${min}, ${max}],\n`;
      } else if (options.validate === "is") {
        const regex = options.validateArgs?.regex || "/.*/";
        line += `        is: ${regex},\n`;
      } else if (options.validate === "isEmail") {
        line += "        isEmail: true,\n";
      } else if (options.validate === "isNumeric") {
        line += "        isNumeric: true,\n";
      } else if (options.validate === "customValidator") {
        const funcBody = options.validateArgs?.functionBody || "";
        line += `        customValidator(value) {\n          ${funcBody}\n        },\n`;
      }
      line += "      }";
    }

    line += "\n    },\n";
    attrString += line;
  }

  return (
    `const { Model, DataTypes } = require('sequelize');\n` +
    `const sequelize = require('../config/db');\n\n` +
    `class ${modelName} extends Model {}\n\n` +
    `${modelName}.init({\n${attrString}}, {\n` +
    `  sequelize,\n  modelName: '${modelName}',\n  tableName: '${modelName.toLowerCase()}s',\n  timestamps: false\n});\n\n` +
    `module.exports = ${modelName};\n`
  );
};


// ------------------------ CRUD APIs ------------------------ //

// CREATE RECORD and MODEL TABLE
const createRecord = async (req, res) => {
  const { modelName, fields, data } = req.body;
  const userId = req.user.id;

  try {
    // Check if model exists for user
    const existing = await getModelByNameAndUser(modelName, userId);
    if (existing) return res.status(400).json({ message: 'Model already exists' });

    // Generate Sequelize model code string
    const code = generateModelCode(modelName, fields);

    // Store model metadata and generated Sequelize code in Models table
    await insertModel(modelName, code, { fields }, userId);

    res.status(201).json({
      message: 'Model and record created'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating record', error: err.message });
  }
};

// READ all models
const getAllModels = async (req, res) => {
  const userId = req.user.id;

  try {
    const models = await getAllModelsForUser(userId);

    res.status(200).json(models);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching models', error: err.message });
  }
};

const getOneModel = async (req, res) => {
 const userId = req.user.id;
  const { modelName } = req.params;

  try {
    const model = await getModelByNameAndUser(modelName, userId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.status(200).json(model);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching model', error: err.message });
  }
};

const getOneModelByID = async (req, res) => {
  const id = req.params.id;

  try {
    const model = await getModelById(id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json(model);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching model', error: err.message });
  }
};

// UPDATE model metadata/code
const updateModel = async (req, res) => {
  const id = req.params.id;
  const { modelName, metadata } = req.body;

  try {
    const existingModel = await getModelById(id);
    if (!existingModel) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const regeneratedCode = generateModelCode(modelName, metadata.fields);

    await updateModelCode(id, modelName, regeneratedCode, metadata);

    res.status(200).json({
      message: 'Model updated successfully',
      code: regeneratedCode
    });
  } catch (err) {
    console.error("Error in updateModel:", err);
    res.status(500).json({ message: 'Error updating model', error: err.message });
  }
};


// DELETE model (metadata only)
const deleteModel = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteModelById(id);
    res.status(200).json({ message: 'Model deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting model', error: err.message });
  }
};

module.exports = {
  createRecord,
  getAllModels,
  getOneModel,
  getOneModelByID,
  updateModel,
  deleteModel,
};