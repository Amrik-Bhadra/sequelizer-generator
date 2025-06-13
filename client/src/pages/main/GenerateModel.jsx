import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useRelation } from "../../contexts/ModelContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
import DropdownComponent from "../../components/common_components/DropdownComponent";
import { RxCross2 } from "react-icons/rx";
import { copyToClipboard } from "../../utils/helperFunctions";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import {
  FiDownload,
  MdContentCopy,
  IoMdAdd,
  RiSubtractLine,
} from "../../utils/iconsProvider";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import toast from "react-hot-toast";

const GenerateModel = () => {
  const [fields, setFields] = useState([
    {
      id: uuidv4(),
      name: "",
      type: "",
      primaryKey: false,
      autoIncrement: false,
      allowNull: true,
      unique: false,
      defaultValue: "",
      validate: "",
      arrayType: "",
    },
  ]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelId, setModelId] = useState(null); 

  const [downloadModal, setDownloadModalClose] = useState(false);
  const [saveDeleteModal, setSaveDeleteModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [item, setItem] = useState("");
  const { addModel, updateModel } = useRelation();
  const location = useLocation();
  const editMode = location.state?.editMode;
  const modelData = location.state?.modelData;

  const navigate = useNavigate();

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

  const handleFieldChange = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  // const handleFieldChange = (id, key, value) => {
  //   setFields((prev) =>
  //     prev.map((field) => {
  //       if (field.id !== id) return field;

  //       if (key === "primaryKey" && value === "Yes") {
  //         return {
  //           ...field,
  //           [key]: value,
  //           autoIncrement: true,
  //           allowNull: false,
  //           unique: true,
  //         };
  //       }

  //       return { ...field, [key]: value };
  //     })
  //   );
  // };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: "",
        type: "String",
        primaryKey: "No",
        autoIncrement: "No",
        allowNull: "No",
        unique: "No",
        defaultValue: "",
        validate: "",
        arrayType: "",
      },
    ]);
  };

  const generateCode = () => {
    if (!modelName) {
      setGeneratedCode("// Please enter a model name");
      return;
    }

    let schema = `const { Model, DataTypes } = require('sequelize');\n`;
    schema += `const sequelize = require('../config/database'); // Adjust path accordingly\n\n`;

    schema += `class ${modelName} extends Model {}\n\n`;

    schema += `${modelName}.init({\n`;

    fields.forEach((field) => {
      if (!field.name) return;

      schema += `  ${field.name}: {\n`;

      // Map your types to Sequelize DataTypes
      let sequelizeType;
      switch (field.type.toLowerCase()) {
        case "string":
          sequelizeType = "DataTypes.STRING";
          break;
        case "number":
          sequelizeType = "DataTypes.INTEGER";
          break;
        case "boolean":
          sequelizeType = "DataTypes.BOOLEAN";
          break;
        case "date":
          sequelizeType = "DataTypes.DATE";
          break;
        case "array":
          if (field.arrayType) {
            let arraySequelizeType;
            switch (field.arrayType.toLowerCase()) {
              case "string":
                arraySequelizeType = "DataTypes.STRING";
                break;
              case "number":
                arraySequelizeType = "DataTypes.INTEGER";
                break;
              case "boolean":
                arraySequelizeType = "DataTypes.BOOLEAN";
                break;
              case "date":
                arraySequelizeType = "DataTypes.DATE";
                break;
              case "object":
                arraySequelizeType = "DataTypes.JSON";
                break;
              case "uuid":
                arraySequelizeType = "DataTypes.UUID";
                break;
              default:
                arraySequelizeType = "DataTypes.STRING";
            }
            sequelizeType = `DataTypes.ARRAY(${arraySequelizeType})`;
          } else {
            sequelizeType = `DataTypes.ARRAY(DataTypes.STRING)`;
          }
          break;
        case "object":
          sequelizeType = "DataTypes.JSON";
          break;
        case "objectid":
          sequelizeType = "DataTypes.UUID";
          break;
        default:
          sequelizeType = "DataTypes.STRING";
      }

      schema += `    type: ${sequelizeType},\n`;

      if (field.primaryKey === "Yes") schema += `    primaryKey: true,\n`;
      if (field.autoIncrement === "Yes") schema += `    autoIncrement: true,\n`;
      if (field.allowNull === "No") schema += `    allowNull: false,\n`;
      if (field.unique === "Yes") schema += `    unique: true,\n`;

      if (field.defaultValue) {
        if (
          field.type.toLowerCase() === "string" ||
          field.type.toLowerCase() === "date"
        ) {
          schema += `    defaultValue: "${field.defaultValue}",\n`;
        } else {
          schema += `    defaultValue: ${field.defaultValue},\n`;
        }
      }

      if (field.validate) {
        schema += `    validate: { ${field.validate}: true },\n`;
      }

      schema += `  },\n`;
    });

    schema += `}, {\n`;
    schema += `  sequelize,\n`;
    schema += `  modelName: '${modelName}',\n`;
    schema += `  tableName: '${modelName.toLowerCase()}s',\n`;
    schema += `  timestamps: true,\n`;
    schema += `});\n\n`;

    schema += `module.exports = ${modelName};\n`;

    setGeneratedCode(schema);
  };

  const deleteField = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!modelName || fields.length === 0) {
        toast.error("Please provide a model name and at least one attribute.");
        return;
      }

      if (modelId) {
        // ✅ Perform UPDATE using known ID
        const updateResponse = await axios.put(
          `http://localhost:3000/api/models/${modelId}`,
          {
            modelName,
            metadata: { fields },
          },
          {
            withCredentials: true,
          }
        );

        if (updateResponse.status === 200) {
          toast.success("Model updated successfully!");
          updateModel(updateResponse.data);
          setSaveDeleteModal(false);
          navigate('/seq/dashboard');
        } else {
          toast.error("Failed to update the model.");
        }

      } else {
        // ❌ No ID means new model — Perform CREATE
        const createResponse = await axios.post(
          "http://localhost:3000/api/models/",
          {
            modelName,
            fields,
          },
          {
            withCredentials: true,
          }
        );

        if (createResponse.status === 201 || createResponse.status === 200) {
          toast.success("Model created successfully!");
          addModel(createResponse.data);
          setSaveDeleteModal(false);
          setFields([
            {
              id: uuidv4(),
              name: "",
              type: "",
              primaryKey: false,
              autoIncrement: false,
              allowNull: true,
              unique: false,
              defaultValue: "",
              validate: "",
              arrayType: "",
            },
          ]);
          setModelName("");
          setGeneratedCode("");
          setModelId(""); 
        } else {
          toast.error("Failed to create the model.");
        }
      }

    } catch (error) {
      console.error("Error saving model:", error);
      alert("Something went wrong while saving the model.");
    }
  };


  useEffect(() => {
    generateCode();
  }, [fields, modelName]);

  useEffect(() => {
    if (editMode && modelData) {
      setModelName(modelData.modelName || ""); // ✅ fixed
      setFields(modelData.metadata.fields || []);
      setModelId(modelData.modelId);
      // console.log("Loaded fields:", modelData.metadata.field);
    }
  }, [editMode, modelData]);

  return (
    <>
      <div className="p-3 grid grid-cols-[minmax(0,2fr)_minmax(400px,1fr)] gap-6">
        {/* Left Section */}
        <div>
          {/* Model Name */}
          <div className="mb-4 p-4 bg-white border rounded-md shadow-sm flex items-center gap-4">
            <label className="text-blue-600 font-semibold text-lg min-w-[100px]">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Model Name Here"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Model Attributes */}
          <div className="mb-4 p-4 bg-white border rounded-md shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
              <h2 className="text-blue-600 text-2xl font-semibold mb-4">
                Model Attributes
              </h2>
              <div>
                <div className="flex gap-2">
                  <SolidIconBtn
                    icon={IoMdAdd}
                    text={"Add"}
                    onClick={addField}
                    className="bg-[#eee] hover:bg-[#ccc] text-secondary text-sm"
                  />

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
            </div>

            {fields.map((field) => (
              <div
                key={field.id}
                className="relative mb-4 p-4 bg-white rounded-md border grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <button
                  onClick={() => deleteField(field.id)}
                  className="absolute top-2 right-2 p-1 text-secondary font-bold text-xl z-10 bg-gray-light1 rounded-full flex items-center justify-center shadow"
                  title="Delete Attribute"
                >
                  <RxCross2 />
                </button>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-medium text-primary-text">
                    Attribute Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Attribute Name"
                    value={field.name}
                    onChange={(e) =>
                      handleFieldChange(field.id, "name", e.target.value)
                    }
                    className="p-2 border rounded text-sm text-gray-700 focus:ring-sky focus:border-sky outline-none transition-all"
                  />
                </div>

                <DropdownComponent
                  label="Field Type"
                  name="type"
                  selectedValue={field.type}
                  onChange={(value) =>
                    handleFieldChange(field.id, "type", value)
                  }
                  options={[
                    { value: "String", label: "String" },
                    { value: "Number", label: "Number" },
                    { value: "Boolean", label: "Boolean" },
                    { value: "Date", label: "Date" },
                    { value: "Array", label: "Array" },
                    { value: "Object", label: "Object" },
                    { value: "ObjectId", label: "ObjectId" },
                  ]}
                  required
                  placeholder="Field Type"
                />

                {/* Show arrayType dropdown only when type is Array */}
                {field.type === "Array" && (
                  <DropdownComponent
                    label="Array Data Type"
                    name="arrayType"
                    selectedValue={field.arrayType}
                    onChange={(value) =>
                      handleFieldChange(field.id, "arrayType", value)
                    }
                    options={[
                      { value: "String", label: "String" },
                      { value: "Number", label: "Number" },
                      { value: "Boolean", label: "Boolean" },
                      { value: "Date", label: "Date" },
                    ]}
                    placeholder="Array Data Type"
                  />
                )}

                <DropdownComponent
                  label="Primary Key"
                  name="primaryKey"
                  selectedValue={field.primaryKey}
                  onChange={(value) =>
                    handleFieldChange(field.id, "primaryKey", value)
                  }
                  options={[
                    { value: "No", label: "No" },
                    { value: "Yes", label: "Yes" },
                  ]}
                  required
                  placeholder="Primary Key"
                />

                <DropdownComponent
                  label="Auto Increment"
                  name="autoIncrement"
                  selectedValue={field.autoIncrement}
                  onChange={(value) =>
                    handleFieldChange(field.id, "autoIncrement", value)
                  }
                  options={[
                    { value: "No", label: "No" },
                    { value: "Yes", label: "Yes" },
                  ]}
                  required
                  placeholder="Auto Increment"
                />

                <DropdownComponent
                  label="Allow Null"
                  name="allowNull"
                  selectedValue={field.allowNull}
                  onChange={(value) =>
                    handleFieldChange(field.id, "allowNull", value)
                  }
                  options={[
                    { value: "No", label: "No" },
                    { value: "Yes", label: "Yes" },
                  ]}
                  required
                  placeholder="Allow Null"
                />

                <DropdownComponent
                  label="Unique"
                  name="unique"
                  selectedValue={field.unique}
                  onChange={(value) =>
                    handleFieldChange(field.id, "unique", value)
                  }
                  options={[
                    { value: "No", label: "No" },
                    { value: "Yes", label: "Yes" },
                  ]}
                  required
                  placeholder="Unique"
                />

                <DropdownComponent
                  label="Validate"
                  name="validate"
                  selectedValue={field.validate}
                  onChange={(value) =>
                    handleFieldChange(field.id, "validate", value)
                  }
                  options={[
                    { value: "", label: "Select validation" },
                    { value: "none", label: "None" },
                    { value: "minLength", label: "minLength" },
                    { value: "maxLength", label: "maxLength" },
                    { value: "pattern", label: "pattern" },
                    { value: "custom", label: "custom" },
                  ]}
                  placeholder="Validation"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white p-4 rounded shadow-sm w-full max-w-full">
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
      </div>

      {downloadModal && (
        <DownloadModal
          generatedCode={generatedCode}
          setDownloadModalClose={setDownloadModalClose}
          modelName={modelName}
        />
      )}

      {saveDeleteModal && (
        <SaveDeleteModal
          onClick={handleSave}
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

export default GenerateModel;
