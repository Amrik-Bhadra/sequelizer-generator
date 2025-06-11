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

const CodeModal = ({code, onClose}) => {
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
  
  const [selectedTheme, setSelectedTheme] = useState("vscDarkPlus");
  return (
    <div className="absolute top-0 left-0 z-10 bg-black/60 h-screen w-screen flex items-center justify-center">
      <div id="code-container" className="bg-white p-4 rounded-md md:w-[60%]">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">Prodct Modal</h1>
          <div id="button-div" className="flex items-center gap-x-3">
            <SolidIconBtn
              icon={MdContentCopy}
              text="Copy"
              onClick={() => {}}
              className="bg-[#eee] text-[#333] text-sm"
            />

            <SolidIconBtn
              icon={FiDownload}
              text="Download"
              onClick={() => {}}
              className="bg-dark-sec-bg text-white text-sm"
            />

            <SolidIconBtn
              text="Close"
              onClick={onClose}
              className="bg-red-500 text-white"
            />

            <SolidIconBtn
              text="Close"
              onClick={onClose}
              className="bg-red-500 text-white"
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
            {code}
          </SyntaxHighlighter>
        </pre>
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

export default CodeModal;
