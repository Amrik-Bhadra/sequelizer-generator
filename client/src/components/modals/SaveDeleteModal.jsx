import React from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { IoIosWarning } from "../../utils/iconsProvider";

const SaveDeleteModal = ({ handleSave, onClose, purpose, item }) => {
  const getColor = () => {
    if (purpose === "save") return "text-warning";
    else return "text-error";
  };
  return (
    <div className="absolute top-0 left-0 z-10 bg-black/60 h-screen w-screen flex items-center justify-center">
      <div id="save-container" className="bg-white p-6 rounded-md md:w-[35%] flex flex-col gap-y-3">
        <div className={`flex items-center gap-x-3 text-2xl ${getColor()}`}>
          <IoIosWarning className="text-5xl" />{" "}
          <h1 className="font-semibold">
            Confirm{" "}
            {purpose.substring(0, 1).toUpperCase() + purpose.substring(1)}
          </h1>
        </div>

        <p className="px-2">
          Are you sure you want to {purpose} the {item} that you have created? You can
          still go back and make changes if you want.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <SolidIconBtn
            icon={null}
            text={"Discard"}
            onClick={onClose}
            className="text-base bg-[#eee] hover:bg-[#ccc] text-secondary"
          />

          <SolidIconBtn
            icon={null}
            text={"Save Model"}
            onClick={() => {
              handleSave;
            }}
            className="bg-secondary text-white text-base hover:bg-dark-ter-bg "
          />
        </div>
      </div>
    </div>
  );
};

export default SaveDeleteModal;
