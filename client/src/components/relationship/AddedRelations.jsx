import React from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { MdDelete } from "../../utils/iconsProvider";

const AddedRelations = () => {
  return (
    <span className="relative border rounded-md p-2 flex flex-col gap-y-1">
      <button className="absolute top-1 right-2 p-2 bg-[#eee] text-[#333] w-fit rounded-full hover:bg-[#ccc] transition-all">
        <MdDelete />
      </button>

      <span className="flex items-center gap-x-2">
        <h3 className="text-sm font-medium text-secondary">Model 1 : </h3>
        <p className="text-sm text-[#aaa] font-medium">User</p>
      </span>
      <span className="flex items-center gap-x-2">
        <h3 className="text-sm font-medium text-secondary">Model 2 : </h3>
        <p className="text-sm text-[#aaa] font-medium">Product</p>
      </span>
      <span className="flex items-center gap-x-2">
        <h3 className="text-sm font-medium text-secondary">Relation : </h3>
        <p className="text-sm text-[#aaa] font-medium">One-to-One</p>
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
  );
};

export default AddedRelations;
