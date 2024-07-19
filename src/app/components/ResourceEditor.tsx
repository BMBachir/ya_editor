import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { isNumberKey } from "./UtilityFunctions/utils";

interface ResourceEditorProps {
  jsonObjects: any[]; // Update with a more specific type if possible
  expandedResourceIndex: number | null;
  toggleKindVisibility: (index: number) => void;
  handleDeleteResource: (index: number) => void;
  setYamlValue: React.Dispatch<React.SetStateAction<string>>;
}

const ResourceEditor: React.FC<ResourceEditorProps> = ({
  jsonObjects,
  expandedResourceIndex,
  toggleKindVisibility,
  handleDeleteResource,
  setYamlValue,
}) => {
  const handleKeyChange = (
    resourceIndex: number,
    path: string,
    newKey: string
  ) => {
    const updatedJsonObjects = jsonObjects.map((obj, index) => {
      if (index === resourceIndex) {
        // Handle key change logic here
        const newObj = { ...obj };
        const parts = path.split(".");
        const lastKey = parts.pop();
        let target = newObj;
        for (const part of parts) {
          target = target[part];
        }
        if (lastKey) {
          const value = target[lastKey];
          delete target[lastKey];
          target[newKey] = value;
        }
        return newObj;
      }
      return obj;
    });

    setYamlValue(JSON.stringify(updatedJsonObjects, null, 2)); // Update YAML
  };

  const handleValueChange = (
    resourceIndex: number,
    path: string,
    newValue: string
  ) => {
    const updatedJsonObjects = jsonObjects.map((obj, index) => {
      if (index === resourceIndex) {
        // Handle value change logic here
        const newObj = { ...obj };
        const parts = path.split(".");
        let target = newObj;
        for (const part of parts.slice(0, -1)) {
          target = target[part];
        }
        const lastKey = parts[parts.length - 1];
        target[lastKey] = newValue;
        return newObj;
      }
      return obj;
    });

    setYamlValue(JSON.stringify(updatedJsonObjects, null, 2)); // Update YAML
  };

  const renderInputs = (obj: any, index: number, path = ""): JSX.Element[] => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      const inputKey = `${index}-${currentPath}`;
      const isNumber = isNumberKey(currentPath);

      return (
        <div key={inputKey} className="mb-2 flex-1">
          <div>
            <label
              htmlFor={`${inputKey}-key`}
              className="block text-sm font-medium text-white mt-2"
            >
              Key:
            </label>
            <input
              id={`${inputKey}-key`}
              type="text"
              value={key}
              onChange={(e) =>
                handleKeyChange(index, currentPath, e.target.value)
              }
              className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`${inputKey}-value`}
              className="block text-sm font-medium text-white mt-2"
            >
              Value:
            </label>
            <input
              id={`${inputKey}-value`}
              type="text"
              value={value}
              onChange={(e) =>
                handleValueChange(index, currentPath, e.target.value)
              }
              className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {jsonObjects.map((obj, index) => (
        <div key={index} className="mb-4 border p-4 rounded-md bg-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => toggleKindVisibility(index)}
              className="text-white hover:text-hoverColor transition-colors"
            >
              {expandedResourceIndex === index ? (
                <IoIosArrowDown className="h-5 w-5" />
              ) : (
                <IoIosArrowForward className="h-5 w-5" />
              )}
              Resource {index + 1}
            </button>
            <button
              onClick={() => handleDeleteResource(index)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <MdDeleteOutline className="h-5 w-5" />
            </button>
          </div>
          {expandedResourceIndex === index && (
            <div className="mt-2">{renderInputs(obj, index)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResourceEditor;
