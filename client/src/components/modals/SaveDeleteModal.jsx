import React from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { IoIosWarning } from "../../utils/iconsProvider";
import { capitalizeFirstLetter } from "../../utils/helperFunctions";

const SaveDeleteModal = ({ onClick, onClose, purpose, item }) => {
  const getColor = () => {
    if (purpose === "save") return "text-warning";
    else return "text-error";
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8 overflow-auto">
      <div
        id="save-container"
        className="bg-white p-6 rounded-md w-[90%] max-w-[480px] flex flex-col gap-y-4 shadow-md"
      >

        <div className={`flex items-center gap-x-3 text-2xl ${getColor()}`}>
          <IoIosWarning className="text-5xl" />{" "}
          <h1 className="font-semibold">
            Confirm {capitalizeFirstLetter(purpose)}
          </h1>
        </div>

        <p className="px-2">
          Are you sure you want to{" "}
          <span className="font-semibold">{purpose}</span> the{" "}
          <span className="font-semibold">{item}</span> that you have created?
          You can still go back and make changes if you want.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <SolidIconBtn
            icon={null}
            text={"Discard"}
            onClick={onClose}
            className="text-base bg-[#eee] hover:bg-[#ccc] text-secondary"
          />

          <SolidIconBtn
            icon={null}
            text={`${capitalizeFirstLetter(purpose)} Model`}
            onClick={(e) => {
              onClick(e);
              onClose();
            }}
            className="bg-secondary text-white text-base hover:bg-dark-ter-bg "
          />
        </div>
      </div>
    </div>
  );
};

export default SaveDeleteModal;
