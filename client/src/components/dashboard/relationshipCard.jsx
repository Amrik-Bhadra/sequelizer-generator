import React from "react";
import {
  MdEdit,
  FiDownload,
  MdDelete,
  FaEye,
  LiaProjectDiagramSolid,
} from "../../utils/iconsProvider";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { formatDateToDMY } from "../../utils/helperFunctions";

const RelationshipCard = ({ relationship, onEdit, onDelete ,onView, onDownload }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 items-start md:items-center px-4 py-3 bg-white dark:bg-dark-ter-bg border border-gray-300 dark:border-none rounded-md mb-3 shadow-sm">
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
            <div className="text-1.25rem font-semibold text-gray-800 dark:text-white">
              {relationship.model2}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-light2">Model 1</div>
          </div>


          {/* Relation Type */}
          <div className="flex flex-col">
            <div className="text-1.25 rem font-semibold dark:text-white text-gray-800">
              {relationship.relationType}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-light2">Relation Type</div>
          </div>
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800 dark:text-white">
              {relationship.model1}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-light2">Model 2</div>
          </div>

          {/* Created On */}
          <div className="flex flex-col">
            <div className="text-1.25rem font-semibold text-gray-800 dark:text-white">
              {formatDateToDMY(relationship.createdAt)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-light2">Created On</div>
          </div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
        {[
          { icon: MdEdit, text: "Edit", onClick: onEdit },
          { icon: MdDelete, text: "Delete", onClick: onDelete },
          { icon: FaEye, text: "View", onClick: onView  },
          { icon: FiDownload, text: "Download", onClick: onDownload },
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