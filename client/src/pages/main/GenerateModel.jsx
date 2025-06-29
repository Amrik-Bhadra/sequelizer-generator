import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRelation } from "../../contexts/ModelContext";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import { IoMdAdd } from "../../utils/iconsProvider";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import toast from "react-hot-toast";
import CodePreviewComponent from "../../components/common_components/CodePreviewComponent";
import ModelAttributeCard from "../../components/modals/ModelAttributeCard";

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

  const handleFieldChange = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: "",
        type: "",
        primaryKey: "No",
        autoIncrement: "No",
        allowNull: "No",
        unique: "No",
        defaultValue: "",
        validate: "",
        validateArgs: {},
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
      if (field.type === "ARRAY") {
        schema += `    type: DataTypes.ARRAY(DataTypes.${field.arrayType}),\n`;
      } else {
        schema += `    type: DataTypes.${field.type},\n`;
      }

      if (field.primaryKey === "Yes") schema += `    primaryKey: true,\n`;
      if (field.autoIncrement === "Yes") schema += `    autoIncrement: true,\n`;
      if (field.allowNull === "No") schema += `    allowNull: false,\n`;
      if (field.unique === "Yes") schema += `    unique: true,\n`;

      if (field.defaultValue) {
        const isString = ["string", "date"].includes(field.type.toLowerCase());
        schema += `    defaultValue: ${isString ? `"${field.defaultValue}"` : field.defaultValue},\n`;
      }

      if (field.validate && field.validate !== "none") {
        schema += `    validate: {\n`;
        if (field.validate === "len") {
          const min = field.validateArgs?.min || 0;
          const max = field.validateArgs?.max || 255;
          schema += `      len: [${min}, ${max}],\n`;
        } else if (field.validate === "is") {
          const regex = field.validateArgs?.regex || "/.*/";
          schema += `      is: ${regex},\n`;
        } else if (field.validate === "isEmail") {
          schema += `      isEmail: true,\n`;
        } else if (field.validate === "isNumeric") {
          schema += `      isNumeric: true,\n`;
        } else if (field.validate === "customValidator") {
          const funcBody = field.validateArgs?.functionBody || "";
          schema += `      customValidator(value) {\n        ${funcBody}\n      },\n`;
        }
        schema += `    },\n`;
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
        const res = await axiosInstance.put(`/models/${modelId}`, {
          modelName,
          metadata: { fields },
        });
        if (res.status === 200) {
          toast.success("Model updated successfully!");
          updateModel(res.data);
          setSaveDeleteModal(false);
          navigate("/seq/dashboard");
        } else {
          toast.error("Failed to update the model.");
        }
      } else {
        const res = await axiosInstance.post("/models/", { modelName, fields });
        if (res.status === 201 || res.status === 200) {
          toast.success("Model created successfully!");
          addModel(res.data);
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
      console.error("Save error:", error);
      toast.error("Something went wrong while saving the model.");
    }
  };

  useEffect(() => {
    generateCode();
  }, [fields, modelName]);

  useEffect(() => {
    if (editMode && modelData) {
      setModelId(modelData.id || "");
      setFields(modelData.metadata.fields || []);
      setModelName(modelData.name);
    }
  }, [editMode, modelData]);

  // Drag Resizing + Responsive
  const [leftPaneWidth, setLeftPaneWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDragging = () => setIsDragging(true);
  const stopDragging = () => setIsDragging(false);

  const handleDragging = (e) => {
    if (!isDragging) return;
    const containerWidth = window.innerWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftPaneWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("mouseup", stopDragging);
    };
  });

  return (
    <>
      <div className="p-4 flex flex-col lg:flex-row w-full h-[calc(100vh-100px)] overflow-hidden">
        {/* Left Section */}
        <div
          className="overflow-auto pr-0 lg:pr-2"
          style={{ width: isLargeScreen ? `${leftPaneWidth}%` : "100%" }}
        >
          {/* Model Name Input */}
          <div className="mb-4 p-4 bg-white dark:bg-dark-sec-bg dark:border-none border rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-primary font-semibold text-lg min-w-[100px]">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Model Name Here"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm dark:text-white dark:placeholder:text-gray-light2 dark:bg-[#6f6f6f4b] dark:border-none"
            />
          </div>

          {/* Model Attributes Section */}
          <div className="mb-4 p-4 bg-white dark:bg-dark-sec-bg dark:border-none border rounded-md shadow-sm flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4 border-b border-gray-300 pb-2">
              <h2 className="text-primary text-2xl font-semibold mb-4">
                Model Attributes
              </h2>
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
                  className="bg-secondary dark:bg-[#474747] text-white text-sm"
                />
              </div>
            </div>

            {fields.map((field) => (
              <ModelAttributeCard
                key={field.id}
                field={field}
                deleteField={deleteField}
                handleFieldChange={handleFieldChange}
              />
            ))}
          </div>
        </div>

        {/* Drag Handle (visible only on large screens) */}
        {isLargeScreen && (
          <div
            className="w-1 cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
            onMouseDown={startDragging}
          />
        )}

        {/* Code Preview Section */}
        <div
          className="overflow-auto flex-1 pl-0 lg:pl-2"
          style={{ width: isLargeScreen ? `${100 - leftPaneWidth}%` : "100%" }}
        >
          <CodePreviewComponent
            generatedCode={generatedCode}
            downloadModal={downloadModal}
            setDownloadModalClose={setDownloadModalClose}
          />
        </div>
      </div>

      {/* Modals */}
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
          onClose={() => setSaveDeleteModal(false)}
          purpose={purpose}
          item={item}
        />
      )}
    </>
  );
};

export default GenerateModel;