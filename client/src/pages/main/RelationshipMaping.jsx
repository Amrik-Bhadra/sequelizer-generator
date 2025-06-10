import React, { useState, useEffect } from "react";
import DropdownComponent from "../../components/common_components/DropdownComponent";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import CodePreviewComponent from "../../components/common_components/CodePreviewComponent";
import AddedRelations from "../../components/relationship/AddedRelations";

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

          {/* lower preview box */}
          <div className="grid md:grid-cols-2 gap-x-2">
            <CodePreviewComponent
              title={"Model 1 Preview"}
              generatedCode={generatedCode}
              downloadModal={downloadModal}
              setDownloadModalClose={setDownloadModalClose}
            />
            <CodePreviewComponent
              title={"Model 2 Preview"}
              generatedCode={generatedCode}
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
