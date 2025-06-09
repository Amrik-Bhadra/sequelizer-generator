import React from "react";

import {
  MdEdit,
  FaDatabase,
  FiDownload,
  MdContentCopy,
  MdDelete,
  FaEye,
} from "../../utils/iconsProvider";
import SolidIconBtn from "../buttons/SolidIconBtn";

const ModelCard = ({ model }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-md mb-3 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center justify-normal gap-6">
        <div className="border border-primary text-primary bg-primary/10 p-1 rounded-md">
          <FaDatabase className="text-3xl" />
        </div>
        <div>
          <div className="text-1.25rem font-semibold text-gray-800">
            {model.name}
          </div>
          <div className="text-sm text-gray-500">{model.createdAt}</div>
        </div>
        <div className="ml-10">
          <div className="text-1.25rem font-semibold text-blue-700 ml-4">
            {model.attributes}
          </div>
          <div className="text-sm text-cyan-600">Attributes</div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex gap-4">
        {[
          { icon: MdEdit, text: "Edit", onClick: () => {} },
          { icon: MdDelete, text: "Delete", onClick: () => {} },
          { icon: FaEye, text: "View", onClick: () => {} },
          { icon: FiDownload, text: "Download", onClick: () => {} },
          { icon: MdContentCopy, text: "Use" },
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

export default ModelCard;