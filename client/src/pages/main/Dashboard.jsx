import React, { useState } from "react";
import ModelCard from "../../components/dashboard/modelCard";
import RelationshipCard from "../../components/dashboard/relationshipCard";
import { FaPlus } from "react-icons/fa";
import { FaArrowRightLong, IoMdAdd } from "../../utils/iconsProvider";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";

// Dummy Data
const dummyModels = Array.from({ length: 23 }, (_, i) => ({
  name: `Model ${i + 1}`,
  attributes: Math.floor(Math.random() * 10 + 1),
  createdAt: "08-06-25",
}));

const dummyRelationships = Array.from({ length: 20 }, () => ({
  model1: "User",
  model2: "Profile",
  relationType: "One-to-one",
  createdAt: "08-06-2025",
}));

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
  // Models State
  const [modelPage, setModelPage] = useState(1);
  const [modelLimit, setModelLimit] = useState(5);

  // Relationships State
  const [relPage, setRelPage] = useState(1);
  const [relLimit, setRelLimit] = useState(5);

  const modelStart = (modelPage - 1) * modelLimit;
  const relStart = (relPage - 1) * relLimit;

  const modelPageCount = Math.ceil(dummyModels.length / modelLimit);
  const relPageCount = Math.ceil(dummyRelationships.length / relLimit);

  const visibleModels = dummyModels.slice(modelStart, modelStart + modelLimit);
  const visibleRels = dummyRelationships.slice(relStart, relStart + relLimit);

  return (
    <div className="space-y-6 p-3 min-h-screen">
      {/* Models */}
      <div className="p-6 bg-white border rounded-md">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-blue-600">
            Models ({dummyModels.length})
          </h2>
          <div className="flex gap-2 flex-wrap">
            <InputField type="text" placeholder="Search models..." />
            <SolidIconBtn
              icon={FaPlus}
              text={"New Model"}
              onClick={() => {}}
              className="bg-secondary text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {visibleModels.map((model, index) => (
            <ModelCard key={index} model={model} />
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>Display</span>
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
            <span>rows in page</span>
            <span className="text-primary font-semibold">{modelPage}</span>
            <span>of {modelPageCount}</span>
          </div>
          <Pagination
            currentPage={modelPage}
            totalPages={modelPageCount}
            onPageChange={(p) => setModelPage(p)}
          />
        </div>
      </div>

      {/* Relationships */}
      <div className="p-6 bg-white border rounded-md">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-blue-600">
            Relationships ({dummyRelationships.length})
          </h2>
          <div className="flex gap-2 flex-wrap">
            <InputField type="text" placeholder="Search Relationships..." />
            <SolidIconBtn
              icon={FaPlus}
              text={"New Relation"}
              onClick={() => {}}
              className="bg-secondary text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {visibleRels.map((rel, index) => (
            <RelationshipCard key={index} relationship={rel} />
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>Display</span>
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
            <span>rows in page</span>
            <span className="text-primary font-semibold">{relPage}</span>
            <span>of {relPageCount}</span>
          </div>
          <Pagination
            currentPage={relPage}
            totalPages={relPageCount}
            onPageChange={(p) => setRelPage(p)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
