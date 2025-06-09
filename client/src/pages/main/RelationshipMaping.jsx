import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import DropdownComponent from "../../components/common_components/DropdownComponent";
import InputField from "../../components/form_components/InputField";
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
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import {
  MdContentCopy,
  FiDownload,
  RiSubtractLine,
  IoMdAdd,
} from "../../utils/iconsProvider";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import { copyToClipboard } from "../../utils/helperFunctions";

const associations = [
  { value: "hasOne", label: "hasOne" },
  { value: "hasMany", label: "hasMany" },
  { value: "belongsTo", label: "belongsTo" },
  { value: "belongsToMany", label: "belongsToMany" },
];

const dummyModels = [
  { value: "User", label: "User" },
  { value: "Post", label: "Post" },
  { value: "Comment", label: "Comment" },
  { value: "Profile", label: "Profile" },
];

const RelationshipMapping = () => {
  const [sourceModel, setSourceModel] = useState("");
  const [targetModel, setTargetModel] = useState("");
  const [associationType, setAssociationType] = useState("hasOne");
  const [foreignKey, setForeignKey] = useState("");
  const [throughModel, setThroughModel] = useState("");
  const [asValue, setAsValue] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

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
  const [downloadModal, setDownloadModalClose] = useState(false);
  const [saveDeleteModal, setSaveDeleteModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [item, setItem] = useState("");

  const generateAssociationCode = () => {
    if (!sourceModel || !targetModel || !associationType) {
      setGeneratedCode("// Please select the models");
      return;
    }

    let assocLine = `${sourceModel}.${associationType}(${targetModel}`;
    const options = [];

    if (foreignKey) options.push(`foreignKey: "${foreignKey}"`);
    if (throughModel && associationType === "belongsToMany") {
      options.push(`through: "${throughModel}"`);
    }
    if (asValue) options.push(`as: "${asValue}"`);

    if (options.length > 0) {
      assocLine += `, { ${options.join(", ")} }`;
    }

    assocLine += ");";

    const code = `// Sequelize association\n${assocLine}`;
    setGeneratedCode(code);
  };

  useEffect(() => {
    generateAssociationCode();
  }, [
    sourceModel,
    targetModel,
    associationType,
    foreignKey,
    throughModel,
    asValue,
  ]);

  const handleSave = () => {

  }

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="max-w-[90vw] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Relationship Mapping Form */}
          <div className="bg-white p-6 rounded-md shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-600">
                  Relationship Mapping
                </h2>
                <div className="flex gap-2">
                  <SolidIconBtn
                    icon={null}
                    text={"Save"}
                    onClick={() => {
                      setSaveDeleteModal(true);
                      setPurpose("save");
                      setItem("model");
                    }}
                    className="bg-secondary text-white text-sm"
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <DropdownComponent
                  label="Select Model 1"
                  selectedValue={sourceModel}
                  onChange={setSourceModel}
                  options={dummyModels}
                  placeholder="Select Model"
                />
                <DropdownComponent
                  label="Relation Type"
                  selectedValue={associationType}
                  onChange={setAssociationType}
                  options={associations}
                  placeholder="Select Type"
                />
                <DropdownComponent
                  label="Select Model 2"
                  selectedValue={targetModel}
                  onChange={setTargetModel}
                  options={dummyModels}
                  placeholder="Select Model"
                />
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <InputField
                  label="Foreign Key (optional)"
                  type="text"
                  name="foreignKey"
                  id="foreignKey"
                  placeholder="e.g. userId"
                  value={foreignKey}
                  onChange={setForeignKey}
                />

                {associationType === "belongsToMany" && (
                  <InputField
                    label="Through Model (only for belongsToMany)"
                    type="text"
                    name="throughModel"
                    id="throughModel"
                    placeholder="e.g. UserRole"
                    value={throughModel}
                    onChange={setThroughModel}
                  />
                )}

                <InputField
                  label="Alias (as:) (optional)"
                  type="text"
                  name="asValue"
                  id="asValue"
                  placeholder="e.g. author"
                  value={asValue}
                  onChange={setAsValue}
                />
              </div>
            </div>
          </div>

          {/* Right: Code Preview */}
          <div className="bg-white p-6 rounded-md shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-blue-600 text-xl font-semibold">Preview</h2>
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
                    onClick={() =>
                      setFontSize((prev) => Math.max(prev - 2, 10))
                    }
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    <RiSubtractLine />
                  </button>
                  <span className="w-8 text-center">{fontSize}px</span>
                  <button
                    onClick={() =>
                      setFontSize((prev) => Math.min(prev + 2, 32))
                    }
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
        </div>
      </div>

      {downloadModal && (
        <DownloadModal
          generatedCode={generatedCode}
          setDownloadModalClose={setDownloadModalClose}
          modelName={sourceModel}
        />
      )}

      {saveDeleteModal && (
        <SaveDeleteModal
          handleSave={handleSave}
          onClose={() => {
            setSaveDeleteModal(false);
          }}
          purpose={purpose}
          item={item}
        />
      )}
    </>
  );
};

export default RelationshipMapping;
