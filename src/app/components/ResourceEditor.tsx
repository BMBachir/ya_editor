import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<{ [key: number]: string }>({});
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleExpand = (path: string) => {
    const newExpandedPaths = new Set(expandedPaths);
    if (newExpandedPaths.has(path)) {
      newExpandedPaths.delete(path);
    } else {
      newExpandedPaths.add(path);
    }
    setExpandedPaths(newExpandedPaths);
  };

  const renderInputs = (obj: any, index: number, path = ""): JSX.Element[] => {
    if (typeof obj !== "object" || obj === null) {
      return [];
    }

    return Object.keys(obj)
      .map((key) => {
        // Skip rendering inputs for apiVersion and kind
        if (key === "apiVersion" || key === "kind") {
          return null;
        }

        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        const inputKey = `${index}-${currentPath}`;
        const isNumber = isNumberKey(currentPath);
        const isObject = typeof value === "object" && value !== null;
        const isExpanded = expandedPaths.has(currentPath);

        return (
          <div key={inputKey} className="mb-2 flex flex-col">
            <div className="flex items-center justify-between gap-5 mt-5 border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full">
              <label
                onClick={() => toggleExpand(currentPath)}
                className="block items-center text-sm font-medium text-white hover:text-hoverColor"
              >
                {key}
              </label>
              {isObject ? (
                <button
                  className="flex items-center gap-2 text-sm font-medium hover:text-hoverColor text-white"
                  onClick={() => toggleExpand(currentPath)}
                >
                  {isExpanded ? (
                    <IoIosArrowDown className="h-4 w-4" />
                  ) : (
                    <IoIosArrowForward className="h-4 w-4" />
                  )}
                </button>
              ) : isNumber ? (
                <input
                  id={`${inputKey}-value`}
                  type="number"
                  value={value === null ? "" : value}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      currentPath,
                      Number(e.target.value)
                    )
                  }
                  className="input block w-full rounded-md"
                />
              ) : (
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value === null ? "" : value}
                  onChange={(e) =>
                    handleInputChange(index, currentPath, e.target.value)
                  }
                  className="input block w-full rounded-md"
                />
              )}
            </div>
            {isObject && isExpanded && (
              <div className="ml-6">
                {renderInputs(value, index, currentPath)}
              </div>
            )}
          </div>
        );
      })
      .filter((element): element is JSX.Element => element !== null); // Filter out null values and ensure the type is JSX.Element
  };

  const renderNestedObjects = (
    obj: any,
    index: number,
    path = ""
  ): JSX.Element[] => {
    if (typeof obj !== "object" || obj === null) {
      return [];
    }

    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      const inputKey = `${index}-${currentPath}`;
      const isNumber = isNumberKey(currentPath);
      const isObject = typeof value === "object" && value !== null;

      return (
        <div key={inputKey} className="mb-2">
          <label className="block text-sm font-medium text-white">{key}</label>
          {isObject ? (
            renderNestedObjects(value, index, currentPath)
          ) : isNumber ? (
            <input
              id={`${inputKey}-value`}
              type="number"
              value={value === null ? "" : value}
              onChange={(e) =>
                handleInputChange(index, currentPath, Number(e.target.value))
              }
              className="input mt-1 block w-full rounded-md"
            />
          ) : (
            <input
              id={`${inputKey}-value`}
              type="text"
              value={value === null ? "" : value}
              onChange={(e) =>
                handleInputChange(index, currentPath, e.target.value)
              }
              className="input mt-1 block w-full rounded-md"
            />
          )}
        </div>
      );
    });
  };

  const renderSimpleView = (obj: any, index: number): JSX.Element[] => {
    const metadata = obj.metadata || {};
    const spec = obj.spec || {};
    const combined = { ...metadata, ...spec };

    return renderNestedObjects(combined, index);
  };

  const renderMetadataAndSpec = (obj: any, index: number) => {
    return (
      <div>
        {renderInputs({ metadata: obj.metadata }, index, "metadata")}
        {renderInputs({ spec: obj.spec }, index, "spec")}
      </div>
    );
  };

  return (
    <div
      id="jsonInputs"
      className="flex flex-col gap-4 overflow-auto h-[650px]"
    >
      {jsonObjects.map((obj, index) => {
        const isDeployment = obj.kind === "Deployment";

        return (
          <div
            key={index}
            className="bg-backgroundColor2 p-4 rounded-lg hover:shadow-md hover:shadow-cyan-950"
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3
                className="text-lg font-medium mb-2 hover:text-hoverColor"
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
                  <div className="transition-all duration-100 ease-in-out opacity-100">
                    {renderSimpleView(obj, index)}
                  </div>
                )}
                {activeTab[index] === "Advanced" && (
                  <div className="transition-all duration-100 ease-in-out opacity-100">
                    {isDeployment
                      ? renderMetadataAndSpec(obj, index)
                      : renderInputs(obj, index)}
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
