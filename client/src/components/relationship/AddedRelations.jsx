import React, { useEffect, useState } from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { MdDelete } from "../../utils/iconsProvider";
import { useRelation } from "../../contexts/ModelContext";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";

const AddedRelations = () => {
  const { relations, setRelations, setEditRelation } = useRelation();
  const [showModal, setShowModal] = useState(false);
  const [relationToDelete, setRelationToDelete] = useState(null);

  const triggerDelete = (id) => {
    setRelationToDelete(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    setRelations((prev) => prev.filter((rel) => rel.id !== relationToDelete));
    setShowModal(false);
  };

  useEffect(()=>{
    console.log('added relations chal gya!!!');
  }, [relations]);

  return (
    <>
      {relations.map((relation) => (
        <span key={relation.id} className="relative border dark:border-none dark:bg-dark-ter-bg rounded-md p-2 flex flex-col gap-y-1">
          <button
            className="absolute top-1 right-2 p-2 bg-[#eee] text-[#333] w-fit rounded-full hover:bg-[#ccc] transition-all"
            onClick={() => triggerDelete(relation.id)}
          >
            <MdDelete />
          </button>

          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary dark:text-white">Model 1:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.sourceModel}</p>
          </span>
          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary dark:text-white">Model 2:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.targetModel}</p>
          </span>
          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary dark:text-white">Relation:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.associationType}</p>
          </span>

          <div className="flex items-center gap-x-2 mt-1">
            <SolidIconBtn
              icon={null}
              text={"Edit"}
              onClick={() => {
                setEditRelation(relation);
                // navigate("/seq/relationship", {
                //   state: {
                //     editMode: true,
                //     relationData: relation,
                //   },
                // });
              }}
              className="bg-[#eee] text-secondary text-xs hover:bg-[#ccc] w-full"
            />
            <SolidIconBtn
              icon={null}
              text={"Details"}
              onClick={() => {
                // You can add logic here to show code preview
                // Or use setShowDetails(true)
              }}
              className="bg-secondary text-white text-xs hover:bg-[#5b5b5b] w-full"
            />
          </div>
        </span>
      ))}

      {showModal && (
        <SaveDeleteModal
          onClick={handleDeleteConfirmed}
          onClose={() => setShowModal(false)}
          purpose="delete"
          item="relation"
        />
      )}
    </>
  );
};

export default AddedRelations;
