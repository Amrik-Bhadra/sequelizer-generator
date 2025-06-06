const  mapRelationshipType = (relationshipType)=> {
    let forwardMethod, reverseMethod;

    switch (relationshipType) {
        case 'one-to-one':
            forwardMethod = 'hasOne';
            reverseMethod = 'belongsTo';
            break;
        case 'one-to-many':
            forwardMethod = 'hasMany';
            reverseMethod = 'belongsTo';
            break;
        case 'many-to-many':
            forwardMethod = 'belongsToMany';
            reverseMethod = 'belongsToMany';
            break;
        default:
            throw new Error(`Unknown relationship type: ${relationshipType}`);
    }

    return { forwardMethod, reverseMethod };
}

module.exports = {mapRelationshipType};