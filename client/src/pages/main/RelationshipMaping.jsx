import React, { useState, useEffect } from "react";
import DropdownComponent from "../../components/common_components/DropdownComponent";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import DownloadModal from "../../components/modals/DownloadModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import CodePreviewComponent from "../../components/common_components/CodePreviewComponent";
import AddedRelations from "../../components/relationship/AddedRelations";
import { useRelation } from "../../contexts/ModelContext";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../../utils/axiosInstance";
import {
  generateAssociationCode,
  generateEditAssociationCode,
} from "../../utils/relationshipCodeGeneration";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const associations = [
  { value: "one-to-one", label: "one-to-one" },
  { value: "one-to-many", label: "one-to-many" },
  { value: "many-to-many", label: "many-to-many" },
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
  const [modelList, setModelList] = useState({});
  const [modelCodes, setModelCodes] = useState({});
  const [metadata, setMetadata] = useState({});
  const { user } = useAuth();

  const {
    relations,
    addRelation,
    clearRelations,
    editRelation,
    setEditRelation,
    updateRelation,
  } = useRelation();
  const location = useLocation();

  // const

  // useeffect 1
  useEffect(() => {
    console.log(`useEffect 1: ${location.state}`);
    if (location.state?.editMode && location.state.relationData) {
      let relation = location.state.relationData;
      console.log("yaha hu mai" + JSON.stringify(relation.model1));
      setSourceModel(relation.model2);
      setTargetModel(relation.model1);
      setAssociationType(
        relation.relationType === "-"
          ? ""
          : relation.relationType.toLowerCase().replace(/\s/g, "-")
      );

      setThroughModel(relation.through === "-" ? "" : relation.through);
      setAsValue(relation.as === "-" ? "" : relation.as);
    }
  }, [location]);

  // use effect2
  useEffect(() => {
    console.log(`useEffect 2: ${JSON.stringify(editRelation)}`);

    if (editRelation) {
      setSourceModel(editRelation.sourceModel);
      setTargetModel(editRelation.targetModel);
      setAssociationType(
        editRelation.associationType.toLowerCase().replace(/\s/g, "-")
      );
      setThroughModel(editRelation.throughModel || "");
      setAsValue(editRelation.asValue || "");
    }
  }, [editRelation]);

  useEffect(() => {
    generateAssociationCode(
      sourceModel,
      targetModel,
      associationType,
      foreignKey,
      throughModel,
      asValue,
      modelCodes,
      setGeneratedCode
    );
  }, [
    sourceModel,
    targetModel,
    associationType,
    foreignKey,
    throughModel,
    asValue,
  ]);

  useEffect(() => {
    if (
      Object.keys(modelCodes).length > 0 &&
      sourceModel &&
      targetModel &&
      associationType
    ) {
      if (location.state?.editMode || editRelation) {
        generateEditAssociationCode(
          metadata,
          sourceModel,
          targetModel,
          associationType,
          foreignKey,
          throughModel,
          asValue,
          setGeneratedCode
        );
      }
    }
  }, [
    modelCodes,
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
        const response = await axiosInstance.get("/models");
        const data = response.data;
        const myOb = {};

        data.forEach((model) => {
          const name = model.name;
          const fields = model.metadata.fields;
          let primaryKey = "";

          fields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(field, "primaryKey")) {
              console.log(field);
              primaryKey = field.name;
            }
          });

          myOb[name] = primaryKey;
        });

        setModelList(myOb);

        const codes = {};
        const metadata = {};
        data.forEach((model) => {
          codes[model.name] = model.code;
          console.log("Metadata:", model.metadata);
          metadata[model.name] =
            typeof model.metadata === "string"
              ? JSON.parse(model.metadata)
              : model.metadata;
        });
        setModelCodes(codes);
        setMetadata(metadata);
        console.log("Metadata:", metadata);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleSave = () => {
    try {
      if (!sourceModel || !targetModel || !associationType || !foreignKey) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const newRelation = {
        id: editRelation?.id || uuidv4(),
        sourceModel,
        targetModel,
        associationType,
        foreignKey,
        throughModel:
          associationType === "one-to-one" || associationType === "one-to-many"
            ? ""
            : throughModel,
        asValue,
      };

      const duplicate = relations.some(
        (rel) =>
          rel.sourceModel === sourceModel &&
          rel.targetModel === targetModel &&
          rel.associationType === associationType &&
          rel.foreignKey === foreignKey &&
          rel.throughModel === throughModel &&
          rel.asValue === asValue
      );

      if (duplicate) {
        toast.error("This relationship already exists!");
        return;
      }

      if (editRelation) {
        // relations.map((r) => (r.id === editRelation.id ? {...r, newRelation} : r));

        updateRelation(newRelation);

        setEditRelation(null);
        toast.success("Relation updated successfully.");
        setSourceModel("");
        setTargetModel("");
        setAssociationType("");
        setForeignKey("");
        setThroughModel("");
        setAsValue("");
        return;
      } else {
        addRelation(newRelation);
        toast.success("Relation saved.");
        setSourceModel("");
        setTargetModel("");
        setAssociationType("");
        setForeignKey("");
        setThroughModel("");
        setAsValue("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFinalSubmit = async () => {
    if (relations.length === 0) {
      toast.error("No relationships to submit!");
      return;
    }
    console.log("User:", user);

    if (!user || !user.id) {
      toast.error("User not logged in!");
      return;
    }

    const payload = {
      userId: user.id,
      relationships: relations.map((rel) => ({
        fromModel: rel.sourceModel,
        toModel: rel.targetModel,
        relationshipType: rel.associationType,
        foreignKey: rel.foreignKey || undefined,
        as: rel.asValue || undefined,
      })),
    };

    try {
      const response = await axiosInstance.post(
        "/relationship/update",
        payload
      );

      if (response.status === 200) {
        toast.success("Relationships submitted successfully!");
        setSourceModel("");
        setTargetModel("");
        setAssociationType("");
        setForeignKey("");
        setThroughModel("");
        setAsValue("");
        clearRelations();
      } else {
        toast.error("Error in submiting relationship");
      }
    } catch (error) {
      console.error("Error submitting relationships:", error);
      toast.error("Failed to submit relationships.");
    }
  };

  useEffect(() => {
    if (sourceModel && modelList[sourceModel]) {
      setForeignKey(modelList[sourceModel]);
    }
  }, [sourceModel, modelList]);

  return (
    <>
      <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* left*/}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-y-4">
          {/* upper box */}
          <div className="bg-white dark:bg-dark-sec-bg p-6 rounded-md shadow-sm">
            {/* header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-primary">
                Relationship Mapping
              </h2>
              <div className="flex gap-2">
                <SolidIconBtn
                  icon={null}
                  text={"Save"}
                  onClick={handleSave}
                  className="bg-secondary text-white text-sm dark:bg-[#474747]"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <DropdownComponent
                label="Select Model 1"
                selectedValue={sourceModel}
                onChange={setSourceModel}
                options={Object.keys(modelList).map((name) => {
                  return {
                    value: name,
                    label: name,
                  };
                })}
                placeholder="Select Model"
                required={true}
              />
              <DropdownComponent
                label="Relation Type"
                selectedValue={associationType}
                onChange={setAssociationType}
                options={associations}
                placeholder="Select Type"
                required={true}
              />
              <DropdownComponent
                label="Select Model 2"
                selectedValue={targetModel}
                onChange={setTargetModel}
                options={Object.keys(modelList).map((name) => {
                  return {
                    value: name,
                    label: name,
                  };
                })}
                placeholder="Select Model"
                required={true}
              />
              {associationType != "many-to-many" && (
                <InputField
                  label="Foreign Key"
                  type="text"
                  name="foreignKey"
                  id="foreignKey"
                  placeholder="e.g. userId"
                  value={foreignKey}
                  onChange={setForeignKey}
                  required={true}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
<div className="col-span-1 lg:col-span-1 bg-white dark:bg-dark-sec-bg rounded-md shadow-sm h-fit p-4">
          <h1 className="text-base text-primary font-semibold">
            Saved Relations
          </h1>

          <div className="flex flex-col gap-y-2 mt-3">
            <AddedRelations />
          </div>

          <SolidIconBtn
            icon={null}
            text={"Final Submit"}
            className="w-full bg-secondary dark:bg-[#eee] text-sm text-white dark:text-secondary mt-4 hover:bg-[#464646]"
            onClick={() => {
              setPurpose("save");
              setItem("relationship");
              setSaveDeleteModal(true);
            }}
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
          onClick={() => {
            if (purpose === "save") {
              handleFinalSubmit();
            } else {
              handleSave();
            }
          }}
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



// import React, { useState, useEffect } from "react";
// import DropdownComponent from "../../components/common_components/DropdownComponent";
// import InputField from "../../components/form_components/InputField";
// import SolidIconBtn from "../../components/buttons/SolidIconBtn";
// import DownloadModal from "../../components/modals/DownloadModal";
// import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
// import CodePreviewComponent from "../../components/common_components/CodePreviewComponent";
// import AddedRelations from "../../components/relationship/AddedRelations";
// import { useRelation } from "../../contexts/ModelContext";
// import { useAuth } from "../../contexts/AuthContext";
// import { v4 as uuidv4 } from "uuid";
// import axiosInstance from "../../utils/axiosInstance";
// import toast from "react-hot-toast";
// import { useLocation } from "react-router-dom";


// const associations = [
//   { value: "one-to-one", label: "one-to-one" },
//   { value: "one-to-many", label: "one-to-many" },
//   { value: "many-to-many", label: "many-to-many" },
// ];

// const RelationshipMapping = () => {
//   const [sourceModel, setSourceModel] = useState("");
//   const [targetModel, setTargetModel] = useState("");
//   const [associationType, setAssociationType] = useState("");
//   const [foreignKey, setForeignKey] = useState("");
//   const [throughModel, setThroughModel] = useState("");
//   const [asValue, setAsValue] = useState("");
//   const [generatedCode, setGeneratedCode] = useState({
//     sourceCode: "",
//     targetCode: "",
//   });

//   const [downloadModal, setDownloadModalClose] = useState(false);
//   const [saveDeleteModal, setSaveDeleteModal] = useState(false);
//   const [purpose, setPurpose] = useState("");
//   const [item, setItem] = useState("");
//   const [modelList, setModelList] = useState([]);
//   const [modelCodes, setModelCodes] = useState({});
//   const { user } = useAuth();

//   const { relations, addRelation, clearRelations, editRelation, setEditRelation } = useRelation();
//   const location = useLocation();

// useEffect(() => {
//   console.log("Location state:", location.state);
//   if (location.state?.editMode && location.state.relationData) {
//     setEditRelation(location.state.relationData);
//   }
// }, [location]);

// useEffect(() => {
//   console.log("editRelation context updated:", editRelation);
//   if (editRelation) {
//     setSourceModel(editRelation.model2);
//     setTargetModel(editRelation.model1);
//     setAssociationType(editRelation.relationType.toLowerCase().replace(/\s/g, "-"));
//     setForeignKey(editRelation.foreignKey || "");
//     setThroughModel(editRelation.through || "");
//     setAsValue(editRelation.as || "");
//   }
// }, [editRelation]);


//   const generateAssociationCode = () => {
//     if (!sourceModel || !targetModel || !associationType) {
//       setGeneratedCode({
//         sourceCode: "// Please select the models",
//         targetCode: "// Please select the models",
//       });
//       return;
//     }

//     let forwardMethod, reverseMethod;

//     switch (associationType) {
//       case "one-to-one":
//         forwardMethod = "hasOne";
//         reverseMethod = "belongsTo";
//         break;
//       case "one-to-many":
//         forwardMethod = "hasMany";
//         reverseMethod = "belongsTo";
//         break;
//       case "many-to-many":
//         forwardMethod = "belongsToMany";
//         reverseMethod = "belongsToMany";
//         break;
//       default:
//         throw new Error(`Unknown relationship type: ${associationType}`);
//     }

//     const buildOptions = (isReverse = false) => {
//       const opts = [];
//       if (foreignKey) opts.push(`foreignKey: "${foreignKey}"`);
//       if (throughModel && forwardMethod === "belongsToMany") {
//         opts.push(`through: "${throughModel}"`);
//       }
//       if (asValue && !isReverse) {
//         opts.push(`as: "${asValue}"`);
//       }
//       return opts.length > 0 ? `, \n\t\t{ ${opts.join(", ")} }` : "";
//     };

//     const forwardLine = `${sourceModel}.${forwardMethod}(models.${targetModel}${buildOptions(
//       false
//     )});`;
//     const reverseLine = `${targetModel}.${reverseMethod}(models.${sourceModel}${buildOptions(
//       true
//     )});`;

//     const updateModelCode = (modelName, relationLine) => {
//       let baseCode = modelCodes[modelName] || "";

//       if (baseCode.includes("static associate(models)")) {
//         baseCode = baseCode.replace(
//           /static associate\(models\) \{([\s\S]*?)\n\s*\}/,
//           (match, inner) => {
//             const lines = inner
//               .trim()
//               .split("\n")
//               .map((line) => line.trim())
//               .filter(Boolean);

//             if (!lines.includes(relationLine)) {
//               lines.push(relationLine);
//             }

//             const newInner = lines.map((line) => `    ${line}`).join("\n");
//             return `static associate(models) {\n${newInner}\n  }`;
//           }
//         );
//       } else {
//         const classRegex = new RegExp(
//           `class\\s+${modelName}\\s+extends\\s+Model\\s*\\{`
//         );
//         const match = baseCode.match(classRegex);

//         if (match) {
//           baseCode = baseCode.replace(
//             classRegex,
//             `${match[0]}\n  static associate(models) {\n    ${relationLine}\n  }`
//           );
//         } else {
//           baseCode += `\n\nstatic associate(models) {\n    ${relationLine}\n  }\n`;
//         }
//       }

//       return baseCode;
//     };

//     const sourceUpdatedCode = updateModelCode(sourceModel, forwardLine);
//     const targetUpdatedCode = updateModelCode(targetModel, reverseLine);

//     setGeneratedCode({
//       sourceCode: sourceUpdatedCode,
//       targetCode: targetUpdatedCode,
//     });
//   };

//   useEffect(() => {
//     generateAssociationCode();
//   }, [
//     sourceModel,
//     targetModel,
//     associationType,
//     foreignKey,
//     throughModel,
//     asValue,
//   ]);

//   useEffect(() => {
//     const fetchModels = async () => {
//       try {
//         const response = await axiosInstance.get("/models");
//         const data = response.data;
//         const names = data.map((model) => model.name);
//         setModelList(names);

//         const codes = {};
//         data.forEach((model) => {
//           codes[model.name] = model.code;
//         });
//         setModelCodes(codes);
//       } catch (error) {
//         console.error("Error fetching models:", error);
//       }
//     };
//     fetchModels();
//   }, []);

//   const handleSave = () => {
//   if (!sourceModel || !targetModel || !associationType) {
//     toast.error("Please fill in all required fields.");
//     return;
//   }

//   const newRelation = {
//     id: editRelation?.id || uuidv4(),
//     sourceModel,
//     targetModel,
//     associationType,
//     foreignKey,
//     throughModel,
//     asValue,
//   };

//   if (editRelation) {
//     const updated = relations.map((r) =>
//       r.id === editRelation.id ? newRelation : r
//     );
//     setEditRelation(null);
//     toast.success("Relation updated successfully.");
//     return clearRelations(updated); // replace if you have updateRelation method
//   }

//   const duplicate = relations.some(
//     (rel) =>
//       rel.sourceModel === sourceModel &&
//       rel.targetModel === targetModel &&
//       rel.associationType === associationType &&
//       rel.foreignKey === foreignKey &&
//       rel.throughModel === throughModel &&
//       rel.asValue === asValue
//   );

//   if (duplicate) {
//     toast.error("This relationship already exists!");
//     return;
//   }

//   addRelation(newRelation);
//   toast.success("Relation saved.");
  
// };


//   const handleFinalSubmit = async () => {
//     if (relations.length === 0) {
//       toast.error("No relationships to submit!");
//       return;
//     }
//     // console.log("User:", user);

//     if (!user || !user.user_id) {
//       toast.error("User not logged in!");
//       return;
//     }

//     const payload = {
//       userId: user.user_id,
//       relationships: relations.map((rel) => ({
//         fromModel: rel.sourceModel,
//         toModel: rel.targetModel,
//         relationshipType: rel.associationType,
//         foreignKey: rel.foreignKey || undefined,
//         as: rel.asValue || undefined,
//       })),
//     };

//     try {
//       const response = await axiosInstance.post(
//         "/relationship/update",
//         payload
//       );

//       if (response.status === 200) {
//         toast.success("Relationships submitted successfully!");
//         clearRelations();
//       } else {
//         toast.error("Error in submiting relationship");
//       }
//     } catch (error) {
//       console.error("Error submitting relationships:", error);
//       toast.error("Failed to submit relationships.");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
//         {/* left*/}
//         <div className="col-span-1 md:col-span-4 flex flex-col gap-y-2">
//           {/* upper box */}
//           <div className="bg-white dark:bg-dark-sec-bg p-6 rounded-md shadow-sm">
//             {/* header */}
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-xl font-semibold text-primary">
//                 Relationship Mapping
//               </h2>
//               <div className="flex gap-2">
//                 <SolidIconBtn
//                   icon={null}
//                   text={"Save"}
//                   onClick={handleSave}
//                   className="bg-secondary text-white text-sm dark:bg-[#474747]"
//                 />
//               </div>
//             </div>

//             {/* Dropdowns */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <DropdownComponent
//                 label="Select Model 1"
//                 selectedValue={sourceModel}
//                 onChange={setSourceModel}
//                 options={modelList.map((name) => ({
//                   value: name,
//                   label: name,
//                 }))}
//                 placeholder="Select Model"
//               />
//               <DropdownComponent
//                 label="Relation Type"
//                 selectedValue={associationType}
//                 onChange={setAssociationType}
//                 options={associations}
//                 placeholder="Select Type"
//               />
//               <DropdownComponent
//                 label="Select Model 2"
//                 selectedValue={targetModel}
//                 onChange={setTargetModel}
//                 options={modelList.map((name) => ({
//                   value: name,
//                   label: name,
//                 }))}
//                 placeholder="Select Model"
//               />
//               {associationType != "many-to-many" && (
//                 <InputField
//                   label="Foreign Key (optional)"
//                   type="text"
//                   name="foreignKey"
//                   id="foreignKey"
//                   placeholder="e.g. userId"
//                   value={foreignKey}
//                   onChange={setForeignKey}
//                 />
//               )}

//               {associationType === "many-to-many" && (
//                 <InputField
//                   label="Through Model"
//                   type="text"
//                   name="throughModel"
//                   id="throughModel"
//                   placeholder="e.g. UserRole"
//                   value={throughModel}
//                   onChange={setThroughModel}
//                 />
//               )}
//               <InputField
//                 label="Alias (as:) (optional)"
//                 type="text"
//                 name="asValue"
//                 id="asValue"
//                 placeholder="e.g. author"
//                 value={asValue}
//                 onChange={setAsValue}
//               />
//             </div>
//           </div>

//           {/* lower preview box */}
//           <div className="grid md:grid-cols-2 gap-x-2">
//             <CodePreviewComponent
//               title={"Model 1 Preview"}
//               generatedCode={generatedCode.sourceCode}
//               downloadModal={downloadModal}
//               setDownloadModalClose={setDownloadModalClose}
//             />
//             <CodePreviewComponent
//               title={"Model 2 Preview"}
//               generatedCode={generatedCode.targetCode}
//               downloadModal={downloadModal}
//               setDownloadModalClose={setDownloadModalClose}
//             />
//           </div>
//         </div>

//         {/* right */}
//         <div className="col-span-1 bg-white dark:bg-dark-sec-bg rounded-md shadow-sm h-fit p-3">
//           <h1 className="text-base text-primary font-semibold">
//             Saved Relations
//           </h1>

//           <div className="flex flex-col gap-y-2 mt-3">
//             <AddedRelations />
//           </div>

//           <SolidIconBtn
//             icon={null}
//             text={"Final Submit"}
//             className="w-full bg-secondary dark:bg-[#eee] text-sm text-white dark:text-secondary mt-4 hover:bg-[#464646]"
//             onClick={() => {
//               setPurpose("save");
//               setItem("relationship");
//               setSaveDeleteModal(true);
//             }}
//           />
//         </div>
//       </div>

//       {downloadModal && (
//         <DownloadModal
//           generatedCode={generatedCode}
//           setDownloadModalClose={setDownloadModalClose}
//           modelName={sourceModel}
//         />
//       )}

//       {saveDeleteModal && (
//         <SaveDeleteModal
//           onClick={() => {
//             if (purpose === "save") {
//               handleFinalSubmit();
//             } else {
//               handleSave();
//             }
//           }}
//           onClose={() => {
//             setSaveDeleteModal(false);
//           }}
//           purpose={purpose}
//           item={item}
//         />
//       )}
//     </>
//   );
// };

// export default RelationshipMapping;
