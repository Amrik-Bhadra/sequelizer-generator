import React from "react";
import InputField from "../form_components/InputField";
import DropdownComponent from "../common_components/DropdownComponent";
import {
  fieldTypeOptions,
  arrayTypeOptions,
  yesNoOptions,
  validationOptions,
} from "../../utils/dataProvider";
import { RxCross2 } from "react-icons/rx";

const ModelAttributeCard = ({ field, deleteField, handleFieldChange }) => {
  return (
    <div
      key={field.id}
      className="relative mb-4 p-4 bg-white dark:bg-dark-ter-bg dark:border-none rounded-md border flex flex-wrap gap-4"
    >
      <button
        onClick={() => deleteField(field.id)}
        className="absolute top-2 right-2 p-1 text-secondary font-bold text-xl z-10 bg-gray-light1 rounded-full flex items-center justify-center shadow"
        title="Delete Attribute"
        style={{ minWidth: "32px", minHeight: "32px" }}
      >
        <RxCross2 />
      </button>

      {/* Attribute Name */}
      <div className="min-w-[200px] flex-1">
        <InputField
          label={"Attribute Name"}
          type={"text"}
          name={"name"}
          id={"name"}
          placeholder={"Attribute Name"}
          value={field.name}
          onChange={(val) => handleFieldChange(field.id, "name", val)}
          required={true}
        />
      </div>

      {/* Field Type */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Field Type"
          name="type"
          selectedValue={field.type}
          onChange={(value) => handleFieldChange(field.id, "type", value)}
          options={fieldTypeOptions}
          required
          placeholder="Field Type"
        />
      </div>

      {/* Show arrayType dropdown only when type is Array */}
      {field.type === "ARRAY" && (
        <div className="min-w-[200px] flex-1">
          <DropdownComponent
            label="Array Data Type"
            name="arrayType"
            selectedValue={field.arrayType}
            onChange={(value) => handleFieldChange(field.id, "arrayType", value)}
            options={arrayTypeOptions}
            placeholder="Array Data Type"
          />
        </div>
      )}

      {/* Primary Key */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Primary Key"
          name="primaryKey"
          selectedValue={field.primaryKey}
          onChange={(value) => {
            handleFieldChange(field.id, "primaryKey", value);

            if (value === "Yes") {
              handleFieldChange(field.id, "autoIncrement", "Yes");
              handleFieldChange(field.id, "allowNull", "No");
              handleFieldChange(field.id, "unique", "Yes");
            }
          }}
          options={yesNoOptions}
          required
          placeholder="Primary Key"
        />
      </div>

      {/* Auto Increment */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Auto Increment"
          name="autoIncrement"
          selectedValue={field.autoIncrement}
          onChange={(value) =>
            handleFieldChange(field.id, "autoIncrement", value)
          }
          options={yesNoOptions}
          required
          placeholder="Auto Increment"
        />
      </div>

      {/* Allow Null */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Allow Null"
          name="allowNull"
          selectedValue={field.allowNull}
          onChange={(value) => handleFieldChange(field.id, "allowNull", value)}
          options={yesNoOptions}
          required
          placeholder="Allow Null"
        />
      </div>

      {/* Unique */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Unique"
          name="unique"
          selectedValue={field.unique}
          onChange={(value) => handleFieldChange(field.id, "unique", value)}
          options={yesNoOptions}
          required
          placeholder="Unique"
        />
      </div>

      {/* Validate Option */}
      <div className="min-w-[200px] flex-1">
        <DropdownComponent
          label="Validate"
          name="validate"
          selectedValue={field.validate}
          onChange={(value) => handleFieldChange(field.id, "validate", value)}
          options={validationOptions}
          placeholder="Validation"
        />
      </div>

      {/* Validation: Length */}
      {field.validate === "len" && (
        <>
          <div className="min-w-[200px] flex-1">
            <InputField
              label={"Min Length"}
              type="number"
              name={"validateArgs"}
              id={"validateArgs"}
              value={field.validateArgs?.min || ""}
              onChange={(val) =>
                handleFieldChange(field.id, "validateArgs", {
                  ...field.validateArgs,
                  min: parseInt(val, 10),
                })
              }
            />
          </div>

          <div className="min-w-[200px] flex-1">
            <InputField
              label={"Max Length"}
              type="number"
              name={"maxLength"}
              id={"maxLength"}
              value={field.validateArgs?.max || ""}
              onChange={(val) =>
                handleFieldChange(field.id, "validateArgs", {
                  ...field.validateArgs,
                  max: parseInt(val, 10),
                })
              }
            />
          </div>
        </>
      )}

      {/* Validation: Regex */}
      {field.validate === "is" && (
        <div className="min-w-[200px] flex-1">
          <InputField
            label={"Regex Pattern"}
            type="text"
            name={"regex"}
            id={"regex"}
            placeholder="e.g. ^[a-zA-Z0-9]+$"
            value={field.validateArgs?.regex || ""}
            onChange={(val) =>
              handleFieldChange(field.id, "validateArgs", {
                ...field.validateArgs,
                regex: val,
              })
            }
          />
        </div>
      )}

      {/* Validation: Custom Validator */}
      {field.validate === "customValidator" && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-light2 mb-1">
            Custom Validator Function
          </label>
          <textarea
            className="w-full mt-1 p-2 border rounded dark:bg-dark-sec-bg dark:border-gray-600 dark:text-white"
            placeholder="function(value) { if (value < 0) throw new Error('Invalid'); }"
            rows={4}
            value={field.validateArgs?.functionBody || ""}
            onChange={(e) =>
              handleFieldChange(field.id, "validateArgs", {
                ...field.validateArgs,
                functionBody: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default ModelAttributeCard;
