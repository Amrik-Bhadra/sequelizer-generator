import React, { useState, useEffect } from "react";
import DropdownComponent from "../../components/common_components/DropdownComponent";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import CodePreviewComponent from "../../components/common_components/CodePreviewComponent";
import AddedRelations from "../../components/relationship/AddedRelations";
import { useRelation } from "../../contexts/ModelContext";
import axios from "axios";

const associations = [
  { value: "one-to-one", label: "one-to-one" },
  { value: "one-to-many", label: "one-to-many" },
  { value: "many-to-many", label: "many-to-many" },
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
  const [associationType, setAssociationType] = useState("");
  const [foreignKey, setForeignKey] = useState("");
  const [throughModel, setThroughModel] = useState("");
  const [asValue, setAsValue] = useState("");
  const [generatedCode, setGeneratedCode] = useState({
    sourceCode: "",
    targetCode: "",
  });

  const [downloadModal, setDownloadModalClose] = useState(false);
  const [saveDeleteModal, setSaveDeleteModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [item, setItem] = useState("");
  const [modelList, setModelList] = useState([]);
  const [modelCodes, setModelCodes] = useState({});

  const { relations, addRelation, updateRelation } = useRelation();

  const generateAssociationCode = () => {
    if (!sourceModel || !targetModel || !associationType) {
      setGeneratedCode({
        sourceCode: "// Please select the models",
        targetCode: "// Please select the models",
      });
      return;
    }

    let forwardMethod, reverseMethod;

    switch (associationType) {
      case "one-to-one":
        forwardMethod = "hasOne";
        reverseMethod = "belongsTo";
        break;
      case "one-to-many":
        forwardMethod = "hasMany";
        reverseMethod = "belongsTo";
        break;
      case "many-to-many":
        forwardMethod = "belongsToMany";
        reverseMethod = "belongsToMany";
        break;
      default:
        throw new Error(`Unknown relationship type: ${associationType}`);
    }

    const buildOptions = (isReverse = false) => {
      const opts = [];
      if (foreignKey) opts.push(`foreignKey: "${foreignKey}"`);
      if (throughModel && forwardMethod === "belongsToMany") {
        opts.push(`through: "${throughModel}"`);
      }
      if (asValue && !isReverse) {
        opts.push(`as: "${asValue}"`);
      }
      return opts.length > 0 ? `, \n\t\t{ ${opts.join(", ")} }` : "";
    };

    const forwardLine = `${sourceModel}.${forwardMethod}(models.${targetModel}${buildOptions(
      false
    )});`;
    const reverseLine = `${targetModel}.${reverseMethod}(models.${sourceModel}${buildOptions(
      true
    )});`;

    const updateModelCode = (modelName, relationLine) => {
      let baseCode = modelCodes[modelName] || "";

      if (baseCode.includes("static associate(models)")) {
        baseCode = baseCode.replace(
          /static associate\(models\) \{([\s\S]*?)\n\s*\}/,
          (match, inner) => {
            const lines = inner
              .trim()
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            if (!lines.includes(relationLine)) {
              lines.push(relationLine);
            }

            const newInner = lines.map((line) => `    ${line}`).join("\n");
            return `static associate(models) {\n${newInner}\n  }`;
          }
        );
      } else {
        const classRegex = new RegExp(
          `class\\s+${modelName}\\s+extends\\s+Model\\s*\\{`
        );
        const match = baseCode.match(classRegex);

        if (match) {
          baseCode = baseCode.replace(
            classRegex,
            `${match[0]}\n  static associate(models) {\n    ${relationLine}\n  }`
          );
        } else {
          baseCode += `\n\nstatic associate(models) {\n    ${relationLine}\n  }\n`;
        }
      }

      return baseCode;
    };

    const sourceUpdatedCode = updateModelCode(sourceModel, forwardLine);
    const targetUpdatedCode = updateModelCode(targetModel, reverseLine);

    setGeneratedCode({
      sourceCode: sourceUpdatedCode,
      targetCode: targetUpdatedCode,
    });
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

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/models");
        console.log("Fetched models:", response.data);
        const data = response.data;
        const names = data.map((model) => model.name);
        setModelList(names);

        const codes = {};
        data.forEach((model) => {
          codes[model.name] = model.code;
        });
        setModelCodes(codes);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleSave = () => {};

  return (
    <>
      <div className="min-h-screen max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* left*/}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-y-2">
          {/* upper box */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            {/* header */}
            <div className="flex justify-between items-center mb-3">
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <DropdownComponent
                label="Select Model 1"
                selectedValue={sourceModel}
                onChange={setSourceModel}
                options={modelList.map((name) => ({
                  value: name,
                  label: name,
                }))}
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
                options={modelList.map((name) => ({
                  value: name,
                  label: name,
                }))}
                placeholder="Select Model"
              />
              {associationType != "many-to-many" && (
                <InputField
                  label="Foreign Key (optional)"
                  type="text"
                  name="foreignKey"
                  id="foreignKey"
                  placeholder="e.g. userId"
                  value={foreignKey}
                  onChange={setForeignKey}
                />
              )}

              {associationType === "many-to-many" && (
                <InputField
                  label="Through Model"
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

          {/* lower preview box */}
          <div className="grid md:grid-cols-2 gap-x-2">
            <CodePreviewComponent
              title={"Model 1 Preview"}
              generatedCode={generatedCode.sourceCode}
              downloadModal={downloadModal}
              setDownloadModalClose={setDownloadModalClose}
            />
            <CodePreviewComponent
              title={"Model 2 Preview"}
              generatedCode={generatedCode.targetCode}
              downloadModal={downloadModal}
              setDownloadModalClose={setDownloadModalClose}
            />
          </div>
        </div>

        {/* right */}
        <div className="col-span-1 bg-white rounded-md shadow-sm h-fit p-3">
          <h1 className="text-base text-primary font-semibold">
            Saved Relations
          </h1>

          <div className="flex flex-col gap-y-2 mt-3">
            <AddedRelations />{" "}
            {/* pass model1 name, model 2 name, relation, and other data */}
          </div>

          <SolidIconBtn
            icon={null}
            text={"Final Submit"}
            className="w-full bg-secondary text-sm text-white mt-4 hover:bg-[#464646]"
          />
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
