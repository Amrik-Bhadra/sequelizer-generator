const mapRelations = (models) => {
  const relationMap = new Map();

  models.forEach((model) => {
    const associations = model.metadata?.associations || [];
    const date = model.createdAt.split("T")[0];

    associations.forEach((assoc) => {
      const from = model.name;
      const to = assoc.target;
      const key = [from, to].sort().join("::");

      const entry = {
        from,
        to,
        type: assoc.type,
        foreignKey: assoc.foreignKey || "-",
        as: assoc.as || "-",
        through: assoc.through || null,
        createdAt: date,
      };

      if (!relationMap.has(key)) {
        relationMap.set(key, []);
      }
      relationMap.get(key).push(entry);
    });
  });

  const results = [];

  relationMap.forEach((entries, key) => {
    const [model1, model2] = key.split("::");

    const types = entries.map((e) => e.type).sort().join("+");
    let relationType = "Unknown";

    if (types === "belongsToMany+belongsToMany") {
      relationType = "Many to Many";
    } else if (types === "belongsTo+hasMany" || types === "hasMany+belongsTo") {
      relationType = "One to Many";
    } else if (types === "belongsTo+hasOne" || types === "hasOne+belongsTo") {
      relationType = "One to One";
    }

    results.push({
      model1,
      model2,
      relationType,
      foreignKey: entries[0].foreignKey,
      as: entries[0].as,
      through: entries[0].through || "-",
      createdAt: entries[0].createdAt,
    });
  });

  return results;
};

export {mapRelations};