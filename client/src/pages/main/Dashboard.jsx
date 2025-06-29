import React, { useState, useEffect } from "react";
import ModelCard from "../../components/dashboard/modelCard";
import RelationshipCard from "../../components/dashboard/relationshipCard";
import { FaPlus } from "react-icons/fa";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CodeModal from "../../components/modals/CodeModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import DownloadModal from "../../components/modals/DownloadModal";
import RelationCodeModal from "../../components/modals/RelationCodeModal";
import { mapRelations } from "../../utils/mapRelationships";
import JSZip from "jszip";
import { useAuth } from "../../contexts/AuthContext";

const ITEMS_PER_PAGE_OPTIONS = [3, 5, 8, 10];

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-end mt-4 gap-2">
    <SolidIconBtn
      icon={null}
      onClick={() => onPageChange(currentPage - 1)}
      text={"Prev"}
      disabled={currentPage === 1}
      className="bg-gray-light1 text-secondary text-sm disabled:bg-gray-100"
    />

    <SolidIconBtn
      icon={null}
      onClick={() => onPageChange(currentPage + 1)}
      text={"Next"}
      disabled={currentPage === totalPages}
      className="bg-secondary text-white text-sm disabled:bg-[#464646]"
    />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTermModel, setSearchTermModel] = useState("");
  const [searchTermRelation, setSearchTermRelation] = useState("");

  const [models, setModels] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [, setLoading] = useState(true);

  const [modelPage, setModelPage] = useState(1);
  const [modelLimit, setModelLimit] = useState(5);
  const [relPage, setRelPage] = useState(1);
  const [relLimit, setRelLimit] = useState(5);

  const [viewCode, setViewCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedModel, setModel] = useState(null);
  const [, setSelectedRelation] = useState(null);

  const [saveDeleteModal, setSaveDeleteModal] = useState(false);
  const [selectModel, setSelectModel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [item, setItem] = useState("");
  const [downloadModal, setDownloadModalClose] = useState(false);
  const [modelName, setModelName] = useState("");

  const [model1, setModel1] = useState("");
  const [model2, setModel2] = useState("");
  const [showRelationCodeModal, setShowRelationCodeModal] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const modelRes = await axiosInstance.get("/models");
      const allModels = modelRes.data || [];
      console.log("Fetched models:", allModels);

      // Use the new mapRelations function to convert raw associations
      const extractedRelationships = mapRelations(allModels);

      setModels(allModels);
      setRelationships(extractedRelationships);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //search
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTermModel.toLowerCase())
  );

  const filteredRelationships = relationships.filter(
    (rel) =>
      rel.model1.toLowerCase().includes(searchTermRelation.toLowerCase()) ||
      rel.model2.toLowerCase().includes(searchTermRelation.toLowerCase()) ||
      rel.relationType.toLowerCase().includes(searchTermRelation.toLowerCase())
  );

  //Delete
  const handleDelete = async () => {
    try {
      const id = selectModel;
      await axiosInstance.delete(`/models/${id}`);
      toast.success("Model deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  const normalizeRelationshipType = (type) => {
    if (!type) return "";
    return type.toLowerCase().replace(/\s+/g, "-");
  };

  //View
  const handleView = async (model) => {
    setModel(model);
    setShowCodeModal(true);
  };

  //Edit
  const handleEdit = async (model) => {
    navigate("/seq/models", {
      state: {
        editMode: true,
        modelData: model,
      },
    });
  };

  const handleRelationshipDelete = async (rel) => {
 
    try {
      const response = await axiosInstance.post("/relationship/delete", {
        userId: user.user_id,
        fromModel: rel.model1,
        toModel: rel.model2,
        relationshipType: normalizeRelationshipType(rel.relationType),
        foreignKey: rel.foreignKey || "",
        as: rel.as || "",
      });

      console.log("Delete response:", response.data);
      toast.success("Relationship deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Delete failed!");
    }
  };

  const handleRelationshipDownload = async (rel) => {
    const model1 = models.find((m) => m.name === rel.model1);
    const model2 = models.find((m) => m.name === rel.model2);

    if (!model1 || !model2) {
      toast.error("One or both related models not found.");
      return;
    }

    try {
      const zip = new JSZip();
      zip.file(`${model1.name}.js`, model1.code || "");
      zip.file(`${model2.name}.js`, model2.code || "");

      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${model1.name}_${model2.name}_relationship.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } catch (err) {
      console.error("Error generating ZIP:", err);
      toast.error("Download failed.");
    }
  };

  //Duplicate
  const handleDuplicate = async (model) => {
    const baseName = model.name + "_copy";
    let newName = baseName;
    let counter = 1;

    const nameExists = (name) =>
      models.some((m) => m.name.toLowerCase() === name.toLowerCase());

    while (nameExists(newName)) {
      newName = `${baseName}_${counter}`;
      counter++;
    }

    const duplicated = {
      modelName: newName,
      fields: model.metadata?.fields || {},
      cloneFrom: model.name,
    };

    try {
      await axiosInstance.post("/models", duplicated);
      toast.success(`Model duplicated as ${newName}`);
      fetchData();
    } catch (err) {
      console.error("Duplication error:", err.response?.data || err);
      toast.error("Duplication failed");
    }
  };

  const modelStart = (modelPage - 1) * modelLimit;
  const relStart = (relPage - 1) * relLimit;

  const visibleModels = filteredModels.slice(
    modelStart,
    modelStart + modelLimit
  );
  const visibleRels = filteredRelationships.slice(
    relStart,
    relStart + relLimit
  );

  const modelPageCount = Math.ceil(filteredModels.length / modelLimit);
  const relPageCount = Math.ceil(filteredRelationships.length / relLimit);

  return (
    <>
      <div className="space-y-6 p-3 max-h-screen h-max max-w-[100vw]">
        {/* Models */}
        <div className="p-6 bg-white dark:bg-dark-sec-bg border dark:border-none rounded-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-primary">
              Models ({models.length})
            </h2>
            <div className="flex gap-2 flex-wrap">
              <InputField
                placeholder="Search models..."
                value={searchTermModel}
                onChange={setSearchTermModel}
                className="w-full max-w-xs"
              />

              <SolidIconBtn
                icon={FaPlus}
                text={"New Model"}
                onClick={() => {
                  navigate("/seq/models");
                }}
                className="bg-secondary text-white dark:bg-[#fff] dark:text-secondary text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {visibleModels.length > 0 ? (
              visibleModels
                .slice((modelPage - 1) * modelLimit, modelPage * modelLimit)
                .map((model, index) => (
                  <ModelCard
                    key={index}
                    model={{
                      ...model,
                      createdAt: new Date(model.createdAt).toLocaleDateString(),
                    }}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={() => {
                      setSaveDeleteModal(true);
                      setSelectModel(model.id);
                      setPurpose("Delete");
                      setItem(model.name);
                    }}
                    onDownload={() => {
                      setDownloadModalClose(!downloadModal);
                      setViewCode(model.code);
                      setModelName(model.name);
                    }}
                    onDuplicate={handleDuplicate}
                  />
                ))
            ) : (
              <h2 className="dark:text-white">No Models Yet</h2>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="dark:text-gray-light2">Display</span>
              <select
                value={modelLimit}
                onChange={(e) => {
                  setModelLimit(parseInt(e.target.value));
                  setModelPage(1);
                }}
                className="border rounded px-2 py-1 text-sm w-[90px]"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span className="dark:text-gray-light2">rows in page</span>
              <span className="text-primary font-semibold">{modelPage}</span>
              <span className="dark:text-gray-light2">of {modelPageCount}</span>
            </div>
            <Pagination
              currentPage={modelPage}
              totalPages={modelPageCount}
              onPageChange={(p) => setModelPage(p)}
            />
          </div>
        </div>

        {/* Relationships */}
        <div className="p-6 bg-white dark:bg-dark-sec-bg border dark:border-none rounded-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-primary">
              Relationships ({relationships.length})
            </h2>
            <div className="flex gap-2 flex-wrap">
              <InputField
                type="text"
                placeholder="Search Relationships..."
                value={searchTermRelation}
                onChange={setSearchTermRelation}
                className="w-full max-w-xs"
              />
              <SolidIconBtn
                icon={FaPlus}
                text={"New Relation"}
                onClick={() => {
                  navigate("/seq/relationship");
                }}
                className="bg-secondary text-white text-sm dark:bg-[#eee] dark:text-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {visibleRels.length > 0 ? (
              visibleRels.map((rel, index) => (
                <RelationshipCard
                  key={index}
                  relationship={rel}
                  onView={() => {
                    const model1 = models.find((m) => m.name === rel.model1);
                    const model2 = models.find((m) => m.name === rel.model2);
                    if (!model1 || !model2) {
                      console.error("Model not found in models list", {
                        model1,
                        model2,
                        rel,
                      });
                      return;
                    }
                    setModel1(model2 || "// No code available for model1");
                    setModel2(model1 || "// No code available for model2");
                    setSelectedRelation(rel);
                    setShowRelationCodeModal(true);
                  }}
                  onEdit={() => {
                    navigate("/seq/relationship", {
                      state: {
                        editMode: true,
                        relationData: rel,
                      },
                    });
                  }}
                  onDelete={() => {
                    setSaveDeleteModal(true);
                    setSelectedRelation(rel.id);
                    setPurpose("Delete Relationship");
                    setItem(`${rel.model1} - ${rel.model2}`);
                  }}
                  onDownload={() => handleRelationshipDownload(rel)}
                />
              ))
            ) : (
              <h2 className="dark:text-white">No Relations Yet</h2>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="dark:text-gray-light2">Display</span>
              <select
                value={relLimit}
                onChange={(e) => {
                  setRelLimit(parseInt(e.target.value));
                  setRelPage(1);
                }}
                className="border rounded px-2 py-1 text-sm w-[90px]"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span className="dark:text-gray-light2">rows in page</span>
              <span className="text-primary font-semibold">{relPage}</span>
              <span className="dark:text-gray-light2">of {relPageCount}</span>
            </div>
            <Pagination
              currentPage={relPage}
              totalPages={relPageCount}
              onPageChange={(p) => setRelPage(p)}
            />
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          selectedModel={selectedModel}
          onClose={() => setShowCodeModal(false)}
        />
      )}

      {showRelationCodeModal && (
        <RelationCodeModal
          model1Name={model1.name}
          model2Name={model2.name}
          code1={model1.code}
          code2={model2.code}
          onClose={() => setShowRelationCodeModal(false)}
        />
      )}

      {saveDeleteModal && (
        <SaveDeleteModal
          onClick={
            purpose === "Delete Relationship"
              ? () => {
                  const rel = relationships.find(
                    (r) => `${r.model1} - ${r.model2}` === item
                  );
                  if (rel) handleRelationshipDelete(rel);
                }
              : handleDelete
          }
          onClose={() => {
            setSaveDeleteModal(false);
          }}
          purpose={purpose}
          item={item}
        />
      )}

      {downloadModal && (
        <DownloadModal
          generatedCode={viewCode}
          setDownloadModalClose={setDownloadModalClose}
          modelName={modelName}
        />
      )}
    </>
  );
};

export default Dashboard;
