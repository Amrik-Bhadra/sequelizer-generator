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
        const { userId, fromModel, toModel, relationshipType, foreignKey } = req.body;

        const { forwardMethod, reverseMethod } = mapRelationshipType(relationshipType);

        const [rowsFrom] = await db.execute(
            `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
            [userId, fromModel]
        );

        if (rowsFrom.length === 0) {
            return res.status(404).json({ message: "From Model not found" });
        }

        let codeFrom = rowsFrom[0].code;
        let metadataFrom = typeof rowsFrom[0].metadata === 'string'
            ? JSON.parse(rowsFrom[0].metadata)
            : rowsFrom[0].metadata;

        let forwardAssoc = metadataFrom.association?.find(assoc =>
            assoc.type === forwardMethod &&
            assoc.target === toModel &&
            assoc.foreignKey === foreignKey
        );

        let forwardAs = forwardAssoc?.as || null;

        let forwardAssociationPattern;
        if (!forwardAs) {
            forwardAssociationPattern = `${fromModel}\\.${forwardMethod}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}' \\}\\);`;
        } else {
            forwardAssociationPattern = `${fromModel}\\.${forwardMethod}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}', as: '${forwardAs}' \\}\\);`;
        }
        const forwardRegex = new RegExp(forwardAssociationPattern, 'g');
        codeFrom = codeFrom.replace(forwardRegex, '');
        codeFrom = codeFrom.replace(/\n\s*\n/g, '\n');

        if (metadataFrom.association) {
            metadataFrom.association = metadataFrom.association.filter(assoc => {
                return !(
                    assoc.type === forwardMethod &&
                    assoc.target === toModel &&
                    assoc.foreignKey === foreignKey
                );
            });
        }

        const cleanMetadataFrom = JSON.parse(JSON.stringify(metadataFrom));

        await db.execute(
            `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
            [codeFrom, JSON.stringify(cleanMetadataFrom), userId, fromModel]
        );

        const [rowsTo] = await db.execute(
            `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
            [userId, toModel]
        );

        if (rowsTo.length === 0) {
            return res.status(404).json({ message: "To Model not found" });
        }

        let codeTo = rowsTo[0].code;
        let metadataTo = typeof rowsTo[0].metadata === 'string'
            ? JSON.parse(rowsTo[0].metadata)
            : rowsTo[0].metadata;
        console.log("Metadata To:", metadataTo);
        console.log(reverseMethod, fromModel, foreignKey);
        let reverseAssoc = metadataTo.association?.find(assoc =>
            assoc.type === reverseMethod &&
            assoc.target === fromModel &&
            assoc.foreignKey === foreignKey 
        );

        let reverseAs = reverseAssoc?.as || null;
        let reverseAssociationPattern;
        if (!reverseAs) {
            reverseAssociationPattern = `${toModel}\\.${reverseMethod}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}' \\}\\);`;
        } else {
            reverseAssociationPattern = `${toModel}\\.${reverseMethod}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}', as: '${reverseAs}' \\}\\);`;
        }
        const reverseRegex = new RegExp(reverseAssociationPattern, 'g');
        codeTo = codeTo.replace(reverseRegex, '');
        codeTo = codeTo.replace(/\n\s*\n/g, '\n');
        if (metadataTo.association) {
            metadataTo.association = metadataTo.association.filter(assoc => {
                return !(
                    assoc.type === reverseMethod &&
                    assoc.target === fromModel &&
                    assoc.foreignKey === foreignKey
                );
            });
        }

        const cleanMetadataTo = JSON.parse(JSON.stringify(metadataTo));

        await db.execute(
            `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
            [codeTo, JSON.stringify(cleanMetadataTo), userId, toModel]
        );

        return res.status(200).json({
            message: "Relationship deleted successfully (both directions)",
            forward: {
                code: codeFrom,
                metadata: metadataFrom
            },
            reverse: {
                code: codeTo,
                metadata: metadataTo
            }
        });

    } catch (error) {
        console.error("Error deleting relationship:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    updateRelationship,
    deleteRelationship
}
