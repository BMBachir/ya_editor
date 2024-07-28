import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { isNumberKey } from "./UtilityFunctions/utils";

import SimpleFields from "./SimpleFields";

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
  const [activeTab, setActiveTab] = useState<{ [key: number]: string }>({});

  const renderInputs = (obj: any, index: number, path = ""): JSX.Element[] => {
    if (typeof obj !== "object" || obj === null) {
      return [];
    }

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
                className="input mt-1 block w-full rounded-md"
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
                  value={value === null ? "value" : value}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      currentPath,
                      Number(e.target.value)
                    )
                  }
                  className="input mt-1 block w-full rounded-md"
                />
              </div>
            ) : (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value === null ? "value" : value}
                  onChange={(e) =>
                    handleInputChange(index, currentPath, e.target.value)
                  }
                  className="input mt-1 block w-full rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div
      id="jsonInputs"
      className="flex flex-col gap-4 overflow-auto h-[650px]"
    >
      {jsonObjects.map((obj, index) => {
        return (
          <div
            key={index}
            className="bg-backgrounColor2 p-4 rounded-lg hover:shadow-md hover:shadow-cyan-950"
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3
                className="text-lg font-medium mb-2 hover:texst-hoverColor"
                onClick={() => toggleKindVisibility(index)}
              >
                Kind: {obj.kind || "Unknown"}
              </h3>
              <div className="flex items-center justify-center gap-5">
                <button
                  className="text-red-400 hover:text-red-500"
                  onClick={() => handleDeleteResource(index)}
                >
                  <MdDeleteOutline className="h-5 w-5" />
                </button>
                <span
                  className="hover:text-hoverColor"
                  onClick={() => toggleKindVisibility(index)}
                >
                  {expandedResourceIndex === index ? (
                    <IoIosArrowDown className="h-5 w-5" />
                  ) : (
                    <IoIosArrowForward className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
            {expandedResourceIndex === index && (
              <div className="rounded-md overflow-auto h-screen transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-start gap-4 mb-4 transition-all duration-100 ease-in-out">
                  <div className="bg-[#021825] py-2 rounded-lg">
                    <button
                      className={`ml-2 py-1 px-3 rounded-lg transition-colors duration-300 ease-in-out ${
                        activeTab[index] === "Simple"
                          ? "bg-[#123551] text-[#02B2EF]"
                          : " text-gray-300"
                      }`}
                      onClick={() =>
                        setActiveTab((prev) => ({ ...prev, [index]: "Simple" }))
                      }
                    >
                      Simple
                    </button>
                    <button
                      className={`mr-2 py-1 px-3 rounded-lg transition-colors duration-300 ease-in-out ${
                        activeTab[index] === "Advanced"
                          ? "bg-[#123551] text-[#02B2EF]"
                          : " text-gray-300"
                      }`}
                      onClick={() =>
                        setActiveTab((prev) => ({
                          ...prev,
                          [index]: "Advanced",
                        }))
                      }
                    >
                      Advanced
                    </button>
                  </div>
                </div>
                {activeTab[index] === "Simple" && (
                  <div className="transition-all duration-100 ease-in-out opacity-100"></div>
                )}
                {activeTab[index] === "Advanced" && (
                  <div className="transition-all duration-100 ease-in-out opacity-100">
                    {renderInputs(obj, index)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResourceEditor;
