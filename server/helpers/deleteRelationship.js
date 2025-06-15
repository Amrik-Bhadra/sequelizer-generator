const db = require("../config/db");


const deleteRelationships = async (fromModel, toModel, userId) => {
  const cleanModel = async (modelName, targetModel, userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM models WHERE user_id = ? AND name = ?`,
      [userId, modelName]
    );

    if (rows.length === 0) {
      console.warn(`Model not found: ${modelName}`);
      return null;
    }

    let code = rows[0].code;
    let metadata = typeof rows[0].metadata === 'string'
      ? JSON.parse(rows[0].metadata)
      : rows[0].metadata;

    const originalAssociations = metadata.associations || [];
    const updatedAssociations = [];
    
    for (const assoc of originalAssociations) {
      if (assoc.target !== targetModel) {
        updatedAssociations.push(assoc);
        continue;
      }

      const { type, foreignKey, as } = assoc;
      let pattern;

      if (type === 'belongsToMany') {
        const [modelA, modelB] = [modelName, targetModel].sort();
        const throughTable = `${modelA}_${modelB}`;

        pattern = `${modelName}\\.${type}\\(models\\.${targetModel},\\s*\\{[^}]*through:\\s*['"]${throughTable}['"][^}]*\\}\\);`;
      } else {
        const fkPart = foreignKey ? `foreignKey:\\s*['"]${foreignKey}['"]` : '';
        const asPart = as ? `as:\\s*['"]${as}['"]` : '';
        const inner = [fkPart, asPart].filter(Boolean).join(',\\s*');
        pattern = `${modelName}\\.${type}\\(models\\.${targetModel},\\s*\\{\\s*${inner}\\s*\\}\\);`;
      }

      const regex = new RegExp(pattern, 'g');
      const newCode = code.replace(regex, '');
      if (newCode === code) {
        console.warn(`No match found for pattern: ${pattern}`);
      }
      code = newCode;
    }

    code = code.replace(/\n\s*\n/g, '\n');
    metadata.associations = updatedAssociations;

    await db.execute(
      `UPDATE models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
      [code, JSON.stringify(metadata), userId, modelName]
    );

    return { code, metadata };
  };

  try {
    const forward = await cleanModel(fromModel, toModel, userId);
    const reverse = await cleanModel(toModel, fromModel, userId);

    return {
      success: true,
      message: "Relationship(s) deleted successfully (both directions)",
      forward,
      reverse,
    };
  } catch (error) {
    console.error("Error deleting relationship:", error);
    return {
      success: false,
      message: "Internal error deleting relationship",
      error: error.message,
    };
  }
};


module.exports = { deleteRelationships };