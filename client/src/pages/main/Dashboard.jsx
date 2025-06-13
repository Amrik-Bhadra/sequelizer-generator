import React, { useState, useEffect } from "react";
import ModelCard from "../../components/dashboard/modelCard";
import RelationshipCard from "../../components/dashboard/relationshipCard";
import { FaPlus } from "react-icons/fa";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CodeModal from "../../components/modals/CodeModal";
import SaveDeleteModal from "../../components/modals/SaveDeleteModal";
import DownloadModal from "../../components/modals/DownloadModal";
import RelationCodeModal from "../../components/modals/RelationCodeModal";
import { mapRelations } from "../../utils/mapRelationships";

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
  const [loading, setLoading] = useState(true);

  const [modelPage, setModelPage] = useState(1);
  const [modelLimit, setModelLimit] = useState(5);
  const [relPage, setRelPage] = useState(1);
  const [relLimit, setRelLimit] = useState(5);

  const [viewCode, setViewCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [showRelationCodeModal, setShowRelationCodeModal] = useState(false);
  // const [modelName, setModelName] = useState("");
  // const [fields, setFields] = useState([]);

  const [saveDeleteModal, setSaveDeleteModal] = useState(false);
  const [selectModel, setSelectModel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [item, setItem] = useState("");
  const [downloadModal, setDownloadModalClose] = useState(false);
  const [modelName, setModelName] = useState("");

  const fetchData = async () => {
  setLoading(true);
  try {
    const modelRes = await axios.get("http://localhost:3000/api/models", {
      withCredentials: true,
    });
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
      console.log("delete item id" + id);
      await axios.delete(`http://localhost:3000/api/models/${id}`, {
        withCredentials: true,
      });
      toast.success("Model deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  //View
  const handleView = async (model) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/models/${model.id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.code) {
        setViewCode(response.data.code); // Set code
        setShowCodeModal(true); // Show modal
      }
    } catch (error) {
      console.error("Error fetching model code:", error);
      alert("Failed to fetch model code.");
    }
  };

  //Edit
  const handleEdit = async (model) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/models/${model.id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const modelData = response.data;
        console.log(`Model data: ${modelData.id}`);

        navigate("/seq/models", {
          state: {
            editMode: true,
            modelData,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching model for edit:", error);
      alert("Failed to fetch model details.");
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
      await axios.post("http://localhost:3000/api/models", duplicated, {
        withCredentials: true,
      });
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
      <div className="space-y-6 p-3 max-h-screen h-max overflow-y-auto">
        {/* Models */}
        <div className="p-6 bg-white dark:bg-dark-sec-bg border dark:border-none rounded-md">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-blue-600">
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
              <h2>No Models Yet</h2>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="dark:text-gray-light2">Display</span>
              <select
                value={modelLimit}
                onChange={(e) => {
                  setModelLimit(parseInt(e.target.value));
                  setModelPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-blue-600">
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
                  onView={()=>{}}
                  onEdit={()=>{setShowRelationCodeModal(true)}}
                />
              ))
            ) : (
              <h2 className="dark:text-white">No Relations Yet</h2>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="dark:text-gray-light2">Display</span>
              <select
                value={relLimit}
                onChange={(e) => {
                  setRelLimit(parseInt(e.target.value));
                  setRelPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
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
        <CodeModal code={viewCode} onClose={() => setShowCodeModal(false)} />
      )}

      {showRelationCodeModal && (
        <RelationCodeModal
          code1={code1}
          code2={code2}
          onClose={() => setShowRelationCodeModal(false)}
        />
      )}

      {saveDeleteModal && (
        <SaveDeleteModal
          onClick={handleDelete}
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
