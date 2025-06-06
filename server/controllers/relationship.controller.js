const db = require('../config/db');
const { mapRelationshipType } = require('../helpers/mapRelationshipType');
const { updateModelAssociation } = require('../helpers/updateModelAssociation');

const updateRelationship = async (req, res) => {
    try {
        const { userId, relationships } = req.body;

        for (const relation of relationships) {
            const { fromModel, toModel, relationshipType, foreignKey, as } = relation;

            const { forwardMethod, reverseMethod } = mapRelationshipType(relationshipType);

            await updateModelAssociation(userId, fromModel, toModel, forwardMethod, foreignKey, as);

            const reverseAs = as ? `reverse_${as}` : fromModel.toLowerCase();
            await updateModelAssociation(userId, toModel, fromModel, reverseMethod, foreignKey, reverseAs);
        }

        return res.status(200).json({
            message: "Relationships updated successfully",
        });

    } catch (error) {
        console.error("Error updating relationships:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const deleteRelationship = async (req, res) => {
  try {
    const { userId, modelName, targetModel, foreignKey } = req.body;

    const [rows] = await db.execute(
      `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
      [userId, modelName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Model not found" });
    }

    const model = rows[0];
    let code = model.code;
    const metadata = typeof model.metadata === 'string'
      ? JSON.parse(model.metadata)
      : model.metadata;

    const assocToDelete = metadata.association.find(
      a => a.target === targetModel && a.foreignKey === foreignKey
    );

    if (!assocToDelete) {
      return res.status(404).json({ message: "Association not found" });
    }

    // Build a robust regex pattern
    const safeModelName = modelName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const safeTargetModel = targetModel.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const safeForeignKey = foreignKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    const associationRegex = new RegExp(
      `${safeModelName}\\.${assocToDelete.type}\\(models\\.${safeTargetModel},\\s*{[^}]*foreignKey:\\s*['"]${safeForeignKey}['"][^}]*}\\);?`,
      'g'
    );

    if (code.includes("static associate(models)")) {
      code = code.replace(
        /static associate\(models\) \{([\s\S]*?)\}/,
        (match, inner) => {
          const updated = inner.replace(associationRegex, '').trim();
          return `static associate(models) {\n${updated}\n  }`;
        }
      );
    } else {
      code = code.replace(associationRegex, '');
    }

    metadata.association = metadata.association.filter(
      a => !(a.target === targetModel && a.foreignKey === foreignKey)
    );

    const metadataString = JSON.stringify(metadata);
    const [result] = await db.execute(
      `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
      [code, metadataString, userId, modelName]
    );

    return res.status(200).json({
      message: "Relationship deleted successfully",
      code,
      metadata
    });

  } catch (error) {
    console.error("Error deleting relationship:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = {
    updateRelationship
}
