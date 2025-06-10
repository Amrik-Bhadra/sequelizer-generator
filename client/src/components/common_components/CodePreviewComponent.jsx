import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { copyToClipboard } from "../../utils/helperFunctions";
import {
  oneDark,
  prism,
  vscDarkPlus,
  coy,
  okaidia,
  solarizedlight,
  tomorrow,
  darcula,
  duotoneDark,
  duotoneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import SolidIconBtn from "../buttons/SolidIconBtn";
import DropdownComponent from "./DropdownComponent";

import {
  MdContentCopy,
  FiDownload,
  RiSubtractLine,
  IoMdAdd,
} from "../../utils/iconsProvider";

const CodePreviewComponent = ({ title, generatedCode, downloadModal, setDownloadModalClose }) => {
  const themeOptions = {
    oneDark,
    prism,
    vscDarkPlus,
    coy,
    okaidia,
    solarizedlight,
    tomorrow,
    darcula,
    duotoneDark,
    duotoneLight,
  };
  const themeNames = Object.keys(themeOptions);

  const [fontSize, setFontSize] = useState(16);
  const [selectedTheme, setSelectedTheme] = useState("vscDarkPlus");
  return (
    <div className="bg-white p-6 rounded-md shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-blue-600 text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <SolidIconBtn
            icon={MdContentCopy}
            text={"Copy"}
            onClick={() => copyToClipboard(generatedCode)}
            className="text-sm bg-[#eee] hover:bg-[#ccc] text-secondary"
          />

          <SolidIconBtn
            icon={FiDownload}
            text={"Download"}
            onClick={() => setDownloadModalClose(!downloadModal)}
            className="bg-secondary text-white text-sm hover:bg-dark-ter-bg "
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex flex-col gap-2">
          <span className="text-base text-blue-600">Font Size:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize((prev) => Math.max(prev - 2, 10))}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <RiSubtractLine />
            </button>
            <span className="w-8 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize((prev) => Math.min(prev + 2, 32))}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <IoMdAdd />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-blue-600 text-base">Theme:</span>
          <DropdownComponent
            name="theme"
            selectedValue={selectedTheme}
            onChange={(value) => setSelectedTheme(value)}
            options={themeNames.map((name) => ({
              value: name,
              label: name,
            }))}
            placeholder="Select Theme"
          />
        </div>
      </div>

      <pre className="overflow-x-auto mt-3 w-full max-w-full">
        <SyntaxHighlighter
          language="javascript"
          style={themeOptions[selectedTheme]}
          showLineNumbers
          className="rounded-md"
          customStyle={{ fontSize: `${fontSize}px` }}
        >
          {generatedCode}
        </SyntaxHighlighter>
      </pre>
    </div>
  );
};

export default CodePreviewComponent;
