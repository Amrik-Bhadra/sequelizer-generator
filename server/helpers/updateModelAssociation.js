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

  const [modelA, modelB] = [modelName, targetModel].sort();
  const throughTable = `${modelA}_${modelB}`;

  // Build association options
  let options = [];

  if (type !== 'belongsToMany' && foreignKey) {
    options.push(`foreignKey: '${foreignKey}'`);
  }

  if (as) {
    options.push(`as: '${as}'`);
  }

  if (type === 'belongsToMany') {
    options.unshift(`through: '${throughTable}'`);
  }
  console.log("Options for association:", options);
  const association = `${modelName}.${type}(models.${targetModel}, { ${options.join(', ')} });`;

  // Inject into static associate block
  if (/static associate\(models\)/.test(code)) {
    code = code.replace(
      /static associate\(models\) \{([\s\S]*?)\n\s*\}/,
      (match, inner) => {
        const lines = inner.trim().split('\n').map(line => line.trim()).filter(Boolean);
        if (!lines.includes(association)) {
          lines.push(association);
        }
        const newInner = lines.map(line => `    ${line}`).join('\n');
        return `static associate(models) {\n${newInner}\n  }`;
      }
    );
  } else {
    code = code.replace(
      new RegExp(`class\\s+${modelName}\\s+extends\\s+Model\\s+\\{`),
      (match) => `${match}\n  static associate(models) {\n    ${association}\n  }`
    );
  }

  // Update metadata
  if (!metadata.associations) {
    metadata.associations = [];
  }

  const exists = metadata.associations.some(
    (a) =>
      a.type === type &&
      a.target === targetModel &&
      (a.foreignKey || null) === (foreignKey || null) &&
      (a.as || null) === (as || null)
  );

  if (!exists) {
    const assocObj = {
      type,
      target: targetModel,
      as: as || null
    };
    if (type !== 'belongsToMany' && foreignKey) assocObj.foreignKey = foreignKey;
    if (type === 'belongsToMany') assocObj.through = throughTable;

    metadata.associations.push(assocObj);
  }

  const metadataString = JSON.stringify(metadata);

  await db.execute(
    `UPDATE models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
    [code, metadataString, userId, modelName]
  );
}



module.exports = {
    updateModelAssociation
}