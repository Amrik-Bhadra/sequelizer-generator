// models.controller.js

const db = require('../config/db'); 

// SQL Helpers
const getModelById = (id) => {
  return db.execute(`SELECT * FROM Models WHERE id = ?`, [id]);
};

const insertModel = async (name, code, metadata, userId) => {
  const [result] = await db.execute(
    `INSERT INTO Models (name, code, metadata, user_id) VALUES (?, ?, ?, ?)`,
    [name, code, JSON.stringify(metadata), userId]
  );
  return result;
};

const updateModelCode = async (id, regeneratedCode, updatedMetadata) => {
  const [result] = await db.execute(
    `UPDATE Models SET code = ?, metadata = ? WHERE id = ?`,
    [regeneratedCode, JSON.stringify(updatedMetadata), id]
  );
  return result;
};

const getModelByNameAndUser = async (name, userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM Models WHERE name = ? AND user_id = ?`,
    [name, userId]
  );
  return rows[0];
};

const getAllModelsForUser = async (userId) => {
  const [rows] = await db.execute(`SELECT * FROM Models WHERE user_id = ?`, [userId]);
  return rows;
};

const deleteModelById = async (id) => {
  const [result] = await db.execute(`DELETE FROM Models WHERE id = ?`, [id]);
  return result;
};

// Generate model code
const generateModelCode = (modelName, fields) => {
  let attrString = '';
  for (const [key, options] of Object.entries(fields)) {
    let line = `    ${key}: {\n      type: DataTypes.${options.type.toUpperCase()}`;
    if (options.allowNull === false) {
      line += ',\n      allowNull: false';
    }
    line += '\n    },\n';
    attrString += line;
  }

  return `const { Model, DataTypes } = require('sequelize');\nconst sequelize = require('../config/db');\n\n` +
    `class ${modelName} extends Model {}\n\n` +
    `${modelName}.init({\n${attrString}}, {\n` +
    `  sequelize,\n  modelName: '${modelName}',\n  tableName: '${modelName.toLowerCase()}s',\n  timestamps: false\n});\n\n` +
    `module.exports = ${modelName};\n`;
};

// ------------------------ CRUD APIs ------------------------ //

// CREATE RECORD and MODEL TABLE
const createRecord = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  const { modelName, fields, data } = req.body;
  const userId = req.session.user.id;

  try {
    // Check if model exists for user
    const existing = await getModelByNameAndUser(modelName, userId);
    if (existing) return res.status(400).json({ message: 'Model already exists' });

    // Generate Sequelize model code string
    const code = generateModelCode(modelName, fields);

    // Store model metadata and generated Sequelize code in Models table
    const newmodel = await insertModel(modelName, code, { fields }, userId);



    res.status(201).json({
      message: 'Model and record created'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating record', error: err.message });
  }
};

// READ all models
const getAllModels = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.session.user.id; // Or from session: req.session.user.id

  try {
    const models = await getAllModelsForUser(userId);
    console.log(models);
    
    res.status(200).json(models);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching models', error: err.message });
  }
};

const getOneModel = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });

  const userId = req.session.user.id;
  const { modelName } = req.params;

  try {
    const model = await getModelByNameAndUser(modelName, userId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });  
    }

    res.status(200).json(model); // ✅ model found
  } catch (err) {
    res.status(500).json({ message: 'Error fetching model', error: err.message });
  }
};

// UPDATE model metadata/code
const updateModel = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });

  const { modelName } = req.params;
  const { metadata } = req.body;
  const userId = req.session.user.id;

  try {
    // 🔍 Find the model by name and user
    const existingModel = await getModelByNameAndUser(modelName, userId);
    if (!existingModel) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // ⚙️ Generate updated Sequelize code
    const regeneratedCode = generateModelCode(modelName, metadata.fields);

    // 🛠 Update the model in DB
    await updateModelCode(existingModel.id, regeneratedCode, metadata);

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
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
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
  updateModel,
  deleteModel,
};
