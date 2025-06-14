import { useState } from "react";
import SolidIconBtn from "../buttons/SolidIconBtn";
import { FiDownload, MdContentCopy } from "../../utils/iconsProvider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import DownloadModal from "../../components/modals/DownloadModal";
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

const RelationCodeModal = ({ code1, code2, model1Name, model2Name, onClose }) => {
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

  const [downloadModal, setDownloadModalClose] = useState(false);
  const [code, setCode] = useState("");
  const [selectedTheme] = useState("vscDarkPlus");
  return (
    <div className="absolute top-0 left-0 z-10 p-6 bg-black/60 min-h-screen w-screen flex items-center justify-center">
      <div
        id="code-container"
        className="relative bg-white p-4 rounded-md w-full max-w-[95%] md:max-w-[90%] grid grid-cols-2 gap-x-10 pt-16"
      >
        <SolidIconBtn
          text="Close"
          onClick={onClose}
          className="bg-red-500 text-white absolute top-3 right-3"
        />
        <div className="w-full">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary">{model1Name} Modal</h1>
            <div id="button-div" className="flex items-center gap-x-3">
              <SolidIconBtn
                icon={MdContentCopy}
                text="Copy"
                onClick={() => {
                  copyToClipboard();
                }}
                className="bg-[#eee] text-[#333] text-sm"
              />

              <SolidIconBtn
                icon={FiDownload}
                text="Download"
                onClick={() => {
                  setCode(code1);
                  setDownloadModalClose(true);
                }}
                className="bg-dark-sec-bg text-white text-sm"
              />
            </div>
          </header>

          <pre className="overflow-x-auto mt-3 w-full max-w-full">
            <SyntaxHighlighter
              language="javascript"
              style={themeOptions[selectedTheme]}
              showLineNumbers
              className="rounded-md"
              customStyle={{ fontSize: `16px` }}
            >
              {code1}
            </SyntaxHighlighter>
          </pre>
        </div>

        <div className="w-full">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary">{model2Name} Modal</h1>
            <div id="button-div" className="flex items-center gap-x-3">
              <SolidIconBtn
                icon={MdContentCopy}
                text="Copy"
                onClick={() => {
                  copyToClipboard();
                }}
                className="bg-[#eee] text-[#333] text-sm"
              />

              <SolidIconBtn
                icon={FiDownload}
                text="Download"
                onClick={() => {
                  setCode(code1);
                  setDownloadModalClose(true);
                }}
                className="bg-dark-sec-bg text-white text-sm"
              />
            </div>
          </header>

          <pre className="overflow-x-auto mt-3 w-full max-w-full">
            <SyntaxHighlighter
              language="javascript"
              style={themeOptions[selectedTheme]}
              showLineNumbers
              className="rounded-md"
              customStyle={{ fontSize: `16px` }}
            >
              {code2}
            </SyntaxHighlighter>
          </pre>
        </div>
      </div>
      {downloadModal && (
        <DownloadModal
          generatedCode={code}
          setDownloadModalClose={setDownloadModalClose}
          // modelName={modelName}
        />
      )}
    </div>
  );
};

export default RelationCodeModal;
