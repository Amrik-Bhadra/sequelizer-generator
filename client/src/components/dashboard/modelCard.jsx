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
import { formatDateToDMY } from "../../utils/helperFunctions";

const ModelCard = ({
  model,
  onEdit,
  onDelete,
  onView,
  onDownload,
  onDuplicate,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 items-start md:items-center px-4 py-3 bg-white dark:bg-dark-ter-bg border border-gray-300 dark:border-none rounded-md mb-3 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center justify-normal gap-6">
        <div className="border border-primary text-primary bg-primary/10 p-1 rounded-md">
          <FaDatabase className="text-3xl" />
        </div>
        <div>
          <div className="text-1.25rem font-semibold text-secondary dark:text-white">
            {model.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-light1">
            {formatDateToDMY(model.createdAt)}
          </div>
        </div>
        <div className="ml-10">
          <div className="text-1.25rem font-semibold text-secondary dark:text-white ml-4">
            {model.metadata?.fields
              ? Object.keys(model.metadata.fields).length
              : 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-light1">Attributes</div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
        <SolidIconBtn
          icon={MdEdit}
          text="Edit"
          onClick={() => onEdit(model)}
          className="bg-gray-light1 text-sm text-secondary"
        />
        <SolidIconBtn
          icon={MdDelete}
          text="Delete"
          onClick={onDelete}
          className="bg-gray-light1 text-sm text-secondary"
        />
        <SolidIconBtn
          icon={FaEye}
          text="View"
          onClick={() => onView(model)}
          className="bg-gray-light1 text-sm text-secondary"
        />
        <SolidIconBtn
          icon={FiDownload}
          text="Download"
          onClick={() => onDownload(model)}
          className="bg-gray-light1 text-sm text-secondary"
        />
        <SolidIconBtn
          icon={MdContentCopy}
          text="Duplicate"
          onClick={() => onDuplicate(model)}
          className="bg-gray-light1 text-sm text-secondary"
        />
      </div>
    </div>
  );
};

export default ModelCard;
