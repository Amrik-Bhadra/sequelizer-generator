import { createContext, useContext, useEffect, useState } from "react";

const RelationContext = createContext({
  relations: [],
  setRelations: () => {},
  models: [],
  setModels: () => {},
  editRelation: null,           
  setEditRelation: () => {}, 
});


export const ModelContextProvider = ({ children }) => {
  const [relations, setRelations] = useState(() => {
    const storedRelations = localStorage.getItem("relations");
    return storedRelations ? JSON.parse(storedRelations) : [];
  });

  const [models, setModels] = useState(() => {
    const storedModels = localStorage.getItem("models");
    return storedModels ? JSON.parse(storedModels) : [];
  });

  useEffect(() => {
    if (relations && relations.length > 0) {
      localStorage.setItem("relations", JSON.stringify(relations));
    } else {
      localStorage.removeItem("relations");
    }
  }, [relations]);

  useEffect(() => {
    if (models && models.length > 0) {
      localStorage.setItem("models", JSON.stringify(models));
    } else {
      localStorage.removeItem("models");
    }
  }, [models]);

  const addRelation = (newRelation) => {
    setRelations((prev) => [...prev, newRelation]);
  };

  const updateRelation = (updatedRelation) => {
    setRelations((prev) =>
      prev.map((relation) =>
        relation.id === updatedRelation.id ? updatedRelation : relation
      )
    );
  };

  const addModel = (newModel) => {
    setModels((prev) => [...prev, newModel]);
  };

  const updateModel = (updatedModel) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === updatedModel.id ? updatedModel : model
      )
    );
  };

  const deleteRelation = (id) => {
  setRelations((prev) => prev.filter((rel) => rel.id !== id));
};

const clearRelations = () => {
  setRelations([]);
  localStorage.removeItem("relations");
}

const [editRelation, setEditRelation] = useState(null);


  return (
    <RelationContext.Provider
      value={{ relations, setRelations, addRelation, updateRelation, addModel, updateModel, deleteRelation, clearRelations, models, setModels, editRelation,
    setEditRelation, }}
    >
      {children}
    </RelationContext.Provider>
  );
};

export const useRelation = () => useContext(RelationContext);
