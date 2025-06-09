import React from "react";
import {
  FaProjectDiagram,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import HollowIconButton from "../../components/buttons/HollowIconButton";

const RelationshipCard = ({ relationship }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md mb-3 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <FaProjectDiagram
          size={35}
          className="text-blue-500 text-xl border-2 border-blue-200 rounded p-1"
        />
        <div className="flex gap-8">
          {/* Model Names */}
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">{relationship.model1}</div>
            <div className="text-sm text-gray-500">Model 1</div>
          </div>

          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">{relationship.model2}</div>
            <div className="text-sm text-gray-500">Model 2</div>
          </div>

          {/* Relation Type */}
          <div className="flex flex-col">
            <div className="text-1.25 rem font-semibold text-green-600">{relationship.relationType}</div>
            <div className="text-sm text-gray-500">Relation Type</div>
          </div>

          {/* Created On */}
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800">{relationship.createdAt}</div>
            <div className="text-sm text-gray-500">Created On</div>
          </div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex gap-3">
        <HollowIconButton icon={FaEdit} text="Edit" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaTrash} text="Delete" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaEye} text="View" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaDownload} text="Download" className="border-gray-400 bg-gray-200" />
      </div>
    </div>
  );
};

export default RelationshipCard;
