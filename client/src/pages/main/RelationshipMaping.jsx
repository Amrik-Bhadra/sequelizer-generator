import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import DropdownComponent from "../../components/common_components/DropdownComponent";
import InputField from "../../components/form_components/InputField";

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
  }, [sourceModel, targetModel, associationType, foreignKey, throughModel, asValue]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Relationship Mapping Form */}
        <div className="bg-white p-6 rounded-md shadow-md lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-600">Relationship Mapping</h2>
              <div className="flex gap-2">
                <button className="bg-gray-200 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">+ Add</button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
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
        <div className="bg-white p-6 rounded-md shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-600">Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Copy
              </button>
              <button className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-blue-600">
                Download
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              customStyle={{ fontSize: 16 }}
              className="rounded-md overflow-x-auto"
              showLineNumbers
            >
              {generatedCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipMapping;
