import React from "react";
import { FaDatabase, FaEdit, FaTrash, FaEye, FaDownload, FaPlus } from "react-icons/fa";
import HollowIconButton from "../../components/buttons/HollowIconButton"; 

const ModelCard = ({ model }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md mb-3 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center justify-normal gap-6">
        <FaDatabase size={35} className="text-blue-500 text-xl border-2 border-blue-200 rounded p-1" />
        <div>
          <div className="text-1.25rem font-semibold text-gray-800">{model.name}</div>
          <div className="text-sm text-gray-500">{model.createdAt}</div>
        </div>
        <div className="ml-10">
            <div className="text-1.25rem font-semibold text-blue-700 ml-4">{model.attributes}</div>
            <div className="text-sm text-cyan-600">Attributes</div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex gap-4">
        <HollowIconButton icon={FaEdit} text="Edit" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaTrash} text="Delete" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaEye} text="View" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaDownload} text="Download" className="border-gray-400 bg-gray-200" />
        <HollowIconButton icon={FaPlus} text="Use" className="border-gray-400 bg-gray-200" />
      </div>
    </div>
  );
};

export default ModelCard;
