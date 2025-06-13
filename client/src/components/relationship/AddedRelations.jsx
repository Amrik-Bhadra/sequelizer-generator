// import React from "react";
// import SolidIconBtn from "../buttons/SolidIconBtn";
// import { MdDelete } from "../../utils/iconsProvider";
// import { useRelation } from "../../contexts/ModelContext";

// const AddedRelations = (relationships) => {
//   return (
//     <span className="relative border rounded-md p-2 flex flex-col gap-y-1">
//       <button className="absolute top-1 right-2 p-2 bg-[#eee] text-[#333] w-fit rounded-full hover:bg-[#ccc] transition-all">
//         <MdDelete />
//       </button>

//       <span className="flex items-center gap-x-2">
//         <h3 className="text-sm font-medium text-secondary">Model 1 : </h3>
//         <p className="text-sm text-[#aaa] font-medium">User</p>
//       </span>
//       <span className="flex items-center gap-x-2">
//         <h3 className="text-sm font-medium text-secondary">Model 2 : </h3>
//         <p className="text-sm text-[#aaa] font-medium">Product</p>
//       </span>
//       <span className="flex items-center gap-x-2">
//         <h3 className="text-sm font-medium text-secondary">Relation : </h3>
//         <p className="text-sm text-[#aaa] font-medium">One-to-One</p>
//       </span>

//       <div className="flex items-center gap-x-2 mt-1">
//         <SolidIconBtn
//           icon={null}
//           text={"Edit"}
//           onClick={() => {}}
//           className="bg-[#eee] text-secondary text-xs hover:bg-[#ccc] w-full"
//         />
//         <SolidIconBtn
//           icon={null}
//           text={"Details"}
//           onClick={() => {}}
//           className="bg-secondary text-white text-xs hover:bg-[#464646] w-full"
//         />
//       </div>
//     </span>
//   );
// };

// export default AddedRelations;

import React, { useState } from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { MdDelete } from "../../utils/iconsProvider";
import { useRelation } from "../../contexts/ModelContext";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";

const AddedRelations = () => {
  const { relations, setRelations } = useRelation();
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

  if (relations.length === 0) {
    return <p className="text-sm text-gray-400">No saved relations.</p>;
  }

  return (
    <>
      {relations.map((relation) => (
        <span key={relation.id} className="relative border rounded-md p-2 flex flex-col gap-y-1">
          <button
            className="absolute top-1 right-2 p-2 bg-[#eee] text-[#333] w-fit rounded-full hover:bg-[#ccc] transition-all"
            onClick={() => triggerDelete(relation.id)}
          >
            <MdDelete />
          </button>

          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary">Model 1:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.sourceModel}</p>
          </span>
          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary">Model 2:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.targetModel}</p>
          </span>
          <span className="flex items-center gap-x-2">
            <h3 className="text-sm font-medium text-secondary">Relation:</h3>
            <p className="text-sm text-[#aaa] font-medium">{relation.associationType}</p>
          </span>

          <div className="flex items-center gap-x-2 mt-1">
            <SolidIconBtn
              icon={null}
              text={"Edit"}
              onClick={() => {}}
              className="bg-[#eee] text-secondary text-xs hover:bg-[#ccc] w-full"
            />
            <SolidIconBtn
              icon={null}
              text={"Details"}
              onClick={() => {}}
              className="bg-secondary text-white text-xs hover:bg-[#464646] w-full"
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
