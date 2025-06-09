import React, { useState } from "react";
import { downloadJsFile } from "../../utils/helperFunctions";
import InputField from "../form_components/InputField";
import { FiDownload } from "../../utils/iconsProvider";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { toast } from "react-hot-toast";

const DownloadModal = ({ generatedCode, setDownloadModalClose, modelName }) => {
  const [fileName, setFileName] = useState(modelName || "");
  return (
    <div className="absolute top-0 left-0 z-10 bg-black/60 h-screen w-screen flex items-center justify-center">
      <div
        id="download-container"
        className="bg-white p-6 rounded-md md:w-[40%] flex flex-col gap-y-3"
      >
        <div className="flex gap-x-2 items-center mb-2">
          <span className="p-3 rounded-full bg-primary/10 text-xl border border-primary text-primary">
            <FiDownload />
          </span>
          <h1 className="text-primary font-semibold text-2xl">Download Code</h1>
        </div>
        <InputField
          label="File Name"
          type="text"
          name="fileName"
          id="fileName"
          placeholder="Enter Filename"
          icon={null}
          error=""
          value={fileName}
          onChange={setFileName}
          required={true}
        />

        <div className="flex gap-2 mt-4">
          <SolidIconBtn
            icon={null}
            text={"Discard"}
            onClick={() => setDownloadModalClose(false)}
            className="text-sm bg-[#eee] hover:bg-[#ccc] text-secondary"
          />

          <SolidIconBtn
            icon={FiDownload}
            text={"Download"}
            onClick={() => {
              downloadJsFile(generatedCode, fileName);
              toast.success(`${fileName}.js donloaded!`);
            }}
            className="bg-secondary text-white text-sm hover:bg-dark-ter-bg "
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
