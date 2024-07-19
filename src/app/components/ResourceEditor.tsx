import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { isNumberKey } from "./UtilityFunctions/utils";

interface ResourceEditorProps {
  jsonObjects: any[];
  expandedResourceIndex: number | null;
  toggleKindVisibility: (index: number) => void;
  handleDeleteResource: (index: number) => void;
  handleKeyChange: (
    resourceIndex: number,
    path: string,
    newKey: string
  ) => void;
  handleInputChange: (
    resourceIndex: number,
    path: string,
    newValue: any
  ) => void;
}

const ResourceEditor: React.FC<ResourceEditorProps> = ({
  jsonObjects,
  expandedResourceIndex,
  toggleKindVisibility,
  handleDeleteResource,
  handleKeyChange,
  handleInputChange,
}) => {
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
            <div>
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
          </div>
          <div>
            <label
              htmlFor={`${inputKey}-value`}
              className="block text-sm font-medium text-white mt-2"
            >
              Value:
            </label>
            {typeof value === "object" && value !== null ? (
              <div className="ml-4">
                {renderInputs(value, index, currentPath)}
              </div>
            ) : isNumber ? (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="number"
                  value={value === null ? "" : value} // Ensure value is not null
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      currentPath,
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            ) : (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value === null ? "" : value} // Ensure value is not null
                  onChange={(e) =>
                    handleInputChange(index, currentPath, e.target.value)
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div id="jsonInputs" className="flex flex-col gap-4 outline-none">
      {jsonObjects.map((obj, index) => (
        <div
          key={index}
          className="mb-4 border p-4 rounded-md bg-backgrounColor2 outline-none"
        >
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
              <h3 className="text-lg font-medium mb-2">
                Kind: {obj.kind || "Unknown"}
              </h3>
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
