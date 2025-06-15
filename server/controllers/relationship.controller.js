const db = require('../config/db');
const { mapRelationshipType } = require('../helpers/mapRelationshipType');
const {deleteRelationships} = require('../helpers/deleteRelationship');
const { updateModelAssociation } = require('../helpers/updateModelAssociation');

const updateRelationship = async (req, res) => {
  try {
    const { userId, relationships } = req.body;

    for (const relation of relationships) {
      const { fromModel, toModel, relationshipType, foreignKey, as } = relation;

      const { forwardMethod, reverseMethod } = mapRelationshipType(relationshipType);
      const isManyToMany = forwardMethod === 'belongsToMany';

      const [rows] = await db.execute(
        `SELECT * FROM models WHERE user_id = ? AND name = ?`,
        [userId, fromModel]
      );

      if (rows.length === 0) {
        console.warn(`Model not found: ${fromModel}`);
        continue;
      }

      const model = rows[0];
      let code = model.code;
      const metadata = typeof model.metadata === 'string'
        ? JSON.parse(model.metadata || '{}')
        : model.metadata || {};

      if (!metadata.associations) {
        metadata.associations = [];
      }

      let shouldDelete = false;
      for (const assoc of metadata.associations) {
        if (
          assoc.type === forwardMethod &&
          assoc.target === toModel &&
          (assoc.foreignKey || null) === (foreignKey || null) &&
          (assoc.as || null) === (as || null)
        ) {
          console.warn(`Association already exists: ${forwardMethod}(${toModel}) on ${fromModel}`);
          shouldDelete = false;
          break;
        }
        if (
          assoc.target === toModel &&
          assoc.type !== forwardMethod
        ) {
          console.warn(`Association already exists with different type: ${assoc.type}(${toModel}) on ${fromModel}`);
          shouldDelete = true;
          break;
        }
      }

      if (shouldDelete) {
        await deleteRelationships(fromModel, toModel, userId);
      }

      // Omit foreignKey for many-to-many
      const forwardFK = isManyToMany ? null : foreignKey;
      const reverseFK = isManyToMany ? null : foreignKey;
      const reverseAs = as ? `reverse_${as}` : fromModel.toLowerCase();

      await updateModelAssociation(userId, fromModel, toModel, forwardMethod, forwardFK, as);
      await updateModelAssociation(userId, toModel, fromModel, reverseMethod, reverseFK, reverseAs);
    }

    return res.status(200).json({
      message: "Relationships updated successfully",
    });
  } catch (error) {
    console.error("Error updating relationships:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteRelationship = async (req, res) => {
  try {
    const { userId, fromModel, toModel, relationshipType, foreignKey, as } = req.body;

    // Delete both directions symmetrically
    const result = await deleteRelationships(fromModel, toModel, userId);

    return res.status(200).json({
      message: "Relationship deleted successfully (both directions)",
      result
    });

  } catch (error) {
    console.error("Error deleting relationship:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


module.exports = {
    updateRelationship,
    deleteRelationship
}
