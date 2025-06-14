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
            const [rows] = await db.execute(
                `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
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
                    assoc.foreignKey === foreignKey &&
                    assoc.as === (as || null)
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
            console.log("Should delete:", shouldDelete);
            if (shouldDelete) {
                console.log(`Deleting existing relationships for ${fromModel} to ${toModel}`);
                await deleteRelationships(fromModel, toModel, userId);
            }
            await updateModelAssociation(userId, fromModel, toModel, forwardMethod, foreignKey, as);
            await updateModelAssociation(userId, toModel, fromModel, reverseMethod, foreignKey, as ? `reverse_${as}` : fromModel.toLowerCase());
        }
        return res.status(200).json({
            message: "Relationships updated successfully",
        })
    } catch (error) {
        console.error("Error updating relationships:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}


const deleteRelationship = async (req, res) => {
    try {
        const { userId, fromModel, toModel, relationshipType, foreignKey } = req.body;
        await deleteRelationships (fromModel,toModel,userId);


        // const { forwardMethod, reverseMethod } = mapRelationshipType(relationshipType);

        // const [rowsFrom] = await db.execute(
        //     `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
        //     [userId, fromModel]
        // );

        // if (rowsFrom.length === 0) {
        //     return res.status(404).json({ message: "From Model not found" });
        // }

        // let codeFrom = rowsFrom[0].code;
        // let metadataFrom = typeof rowsFrom[0].metadata === 'string'
        //     ? JSON.parse(rowsFrom[0].metadata)
        //     : rowsFrom[0].metadata;

        // let forwardAssoc = metadataFrom.associations?.find(assoc =>
        //     assoc.type === forwardMethod &&
        //     assoc.target === toModel &&
        //     assoc.foreignKey === foreignKey
        // );

        // let forwardAs = forwardAssoc?.as || null;

        // let forwardAssociationPattern;
        // if(forwardMethod === 'belongsToMany') {
        //     const [modelA, modelB] = [fromModel, toModel].sort();
        //     const throughTable = `${modelA}_${modelB}`;
        //     if (!forwardAs) {
        //         forwardAssociationPattern = `${fromModel}\\.${forwardMethod}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}', through: '${throughTable}' \\}\\);`;
        //     } else {
        //         forwardAssociationPattern = `${fromModel}\\.${forwardMethod}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}', through: '${throughTable}', as: '${forwardAs}' \\}\\);`;
        //     }
        // }
        // const forwardRegex = new RegExp(forwardAssociationPattern, 'g');
        // codeFrom = codeFrom.replace(forwardRegex, '');
        // codeFrom = codeFrom.replace(/\n\s*\n/g, '\n');

        // if (metadataFrom.associations) {
        //     metadataFrom.associations = metadataFrom.associations.filter(assoc => {
        //         return !(
        //             assoc.type === forwardMethod &&
        //             assoc.target === toModel &&
        //             assoc.foreignKey === foreignKey
        //         );
        //     });
        // }

        // const cleanMetadataFrom = JSON.parse(JSON.stringify(metadataFrom));

        // await db.execute(
        //     `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
        //     [codeFrom, JSON.stringify(cleanMetadataFrom), userId, fromModel]
        // );

        // const [rowsTo] = await db.execute(
        //     `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
        //     [userId, toModel]
        // );

        // if (rowsTo.length === 0) {
        //     return res.status(404).json({ message: "To Model not found" });
        // }

        // let codeTo = rowsTo[0].code;
        // let metadataTo = typeof rowsTo[0].metadata === 'string'
        //     ? JSON.parse(rowsTo[0].metadata)
        //     : rowsTo[0].metadata;
        // console.log("Metadata To:", metadataTo);
        // console.log(reverseMethod, fromModel, foreignKey);
        // let reverseAssoc = metadataTo.associations?.find(assoc =>
        //     assoc.type === reverseMethod &&
        //     assoc.target === fromModel &&
        //     assoc.foreignKey === foreignKey
        // );

        // let reverseAs = reverseAssoc?.as || null;
        // let reverseAssociationPattern;
        // if(reverseMethod === 'belongsToMany') {
        //     const [modelA, modelB] = [toModel, fromModel].sort();
        //     const throughTable = `${modelA}_${modelB}`;
        //     if (!reverseAs) {
        //         reverseAssociationPattern = `${toModel}\\.${reverseMethod}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}', through: '${throughTable}' \\}\\);`;
        //     } else {
        //         reverseAssociationPattern = `${toModel}\\.${reverseMethod}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}', through: '${throughTable}', as: '${reverseAs}' \\}\\);`;
        //     }
        // }
        // const reverseRegex = new RegExp(reverseAssociationPattern, 'g');
        // codeTo = codeTo.replace(reverseRegex, '');
        // codeTo = codeTo.replace(/\n\s*\n/g, '\n');
        // if (metadataTo.associations) {
        //     metadataTo.associations = metadataTo.associations.filter(assoc => {
        //         return !(
        //             assoc.type === reverseMethod &&
        //             assoc.target === fromModel &&
        //             assoc.foreignKey === foreignKey
        //         );
        //     });
        // }

        // const cleanMetadataTo = JSON.parse(JSON.stringify(metadataTo));

        // await db.execute(
        //     `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
        //     [codeTo, JSON.stringify(cleanMetadataTo), userId, toModel]
        // );

        return res.status(200).json({
            message: "Relationship deleted successfully (both directions)",
            
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
