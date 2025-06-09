import React from "react";
import {
  MdEdit,
  FiDownload,
  MdDelete,
  FaEye,
  LiaProjectDiagramSolid,
} from "../../utils/iconsProvider";
import SolidIconBtn from "../buttons/SolidIconBtn";

const RelationshipCard = ({ relationship }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md mb-3 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <div className="border border-primary text-primary bg-primary/10 p-1 rounded-md">
          <LiaProjectDiagramSolid
            className="text-3xl"
          />
        </div>
        <div className="flex gap-8">
          {/* Model Names */}
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">
              {relationship.model1}
            </div>
            <div className="text-sm text-gray-500">Model 1</div>
          </div>

          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">
              {relationship.model2}
            </div>
            <div className="text-sm text-gray-500">Model 2</div>
          </div>

          {/* Relation Type */}
          <div className="flex flex-col">
            <div className="text-1.25 rem font-semibold text-green-600">
              {relationship.relationType}
            </div>
            <div className="text-sm text-gray-500">Relation Type</div>
          </div>

          {/* Created On */}
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">
              {relationship.createdAt}
            </div>
            <div className="text-sm text-gray-500">Created On</div>
          </div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex gap-4">
        {[
          { icon: MdEdit, text: "Edit", onClick: () => {} },
          { icon: MdDelete, text: "Delete", onClick: () => {} },
          { icon: FaEye, text: "View", onClick: () => {} },
          { icon: FiDownload, text: "Download", onClick: () => {} },
        ].map(({ icon, text, onClick }, index) => (
          <SolidIconBtn
            key={index}
            icon={icon}
            text={text}
            onClick={onClick}
            className="bg-gray-light1 text-sm text-secondary"
          />
        ))}
      </div>
    </div>
  );
};

export default RelationshipCard;
