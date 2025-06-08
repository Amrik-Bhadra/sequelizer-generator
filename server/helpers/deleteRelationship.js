const db = require("../config/db");

const deleteRelationships = async (fromModel, toModel, userId) => {
    try {
        // Fetch 'from' model
        const [rowsFrom] = await db.execute(
            `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
            [userId, fromModel]
        );
        if (rowsFrom.length === 0) {
            console.warn(`From Model not found: ${fromModel}`);
            return;
        }

        let codeFrom = rowsFrom[0].code;
        let metadataFrom = typeof rowsFrom[0].metadata === 'string'
            ? JSON.parse(rowsFrom[0].metadata)
            : rowsFrom[0].metadata;

        // Remove associations pointing to toModel
        const associationsFrom = metadataFrom.associations || [];
        for (const assoc of associationsFrom.filter(a => a.target === toModel)) {
            const { type, foreignKey, as } = assoc;
            const pattern = as
                ? `${fromModel}\\.${type}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}', as: '${as}' \\}\\);`
                : `${fromModel}\\.${type}\\(models\\.${toModel}, \\{ foreignKey: '${foreignKey}' \\}\\);`;
            const regex = new RegExp(pattern, 'g');
            codeFrom = codeFrom.replace(regex, '');
        }
        codeFrom = codeFrom.replace(/\n\s*\n/g, '\n');
        metadataFrom.associations = associationsFrom.filter(a => a.target !== toModel);

        await db.execute(
            `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
            [codeFrom, JSON.stringify(metadataFrom), userId, fromModel]
        );

        // Fetch 'to' model
        const [rowsTo] = await db.execute(
            `SELECT * FROM Models WHERE user_id = ? AND name = ?`,
            [userId, toModel]
        );
        if (rowsTo.length === 0) {
            console.warn(`To Model not found: ${toModel}`);
            return;
        }

        let codeTo = rowsTo[0].code;
        let metadataTo = typeof rowsTo[0].metadata === 'string'
            ? JSON.parse(rowsTo[0].metadata)
            : rowsTo[0].metadata;

        // Remove associations pointing to fromModel
        const associationsTo = metadataTo.associations || [];
        for (const assoc of associationsTo.filter(a => a.target === fromModel)) {
            const { type, foreignKey, as } = assoc;
            if( !as) {
                pattern = `${toModel}\\.${type}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}' \\}\\);`;
            }else{
                pattern = `${toModel}\\.${type}\\(models\\.${fromModel}, \\{ foreignKey: '${foreignKey}', as: '${as}' \\}\\);`;
            }
            const regex = new RegExp(pattern, 'g');
            codeTo = codeTo.replace(regex, '');
        }
        codeTo = codeTo.replace(/\n\s*\n/g, '\n');
        metadataTo.associations = associationsTo.filter(a => a.target !== fromModel);
        await db.execute(
            `UPDATE Models SET code = ?, metadata = ? WHERE user_id = ? AND name = ?`,
            [codeTo, JSON.stringify(metadataTo), userId, toModel]
        );
        return {
            success: true,
            message: "Relationship(s) deleted successfully (both directions)",
            forward: { code: codeFrom, metadata: metadataFrom },
            reverse: { code: codeTo, metadata: metadataTo }
        };

    } catch (error) {
        console.error("Error deleting relationship:", error);
        return {
            success: false,
            message: "Internal error deleting relationship",
            error: error.message
        };

    }
}

module.exports = { deleteRelationships };