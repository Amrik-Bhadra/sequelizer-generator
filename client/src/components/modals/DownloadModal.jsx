import React, { useState } from "react";
import { downloadJsFile } from "../../utils/helperFunctions";
import InputField from "../form_components/InputField";
import { FiDownload } from "../../utils/iconsProvider";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { toast } from "react-hot-toast";

const DownloadModal = ({ generatedCode, setDownloadModalClose, modelName }) => {
  const [fileName, setFileName] = useState(modelName || "");
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8 overflow-auto">
      <div
        id="download-container"
        className="bg-white dark:bg-[#333] p-6 rounded-md w-[90%] max-w-[500px] flex flex-col gap-y-4 shadow-md"
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

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
              setDownloadModalClose(false);
            }}
            className="bg-secondary dark:bg-[#565656] text-white text-sm hover:bg-dark-ter-bg dark:hover:bg-dark-ter-bg"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
