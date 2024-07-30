import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { isNumberKey } from "./UtilityFunctions/utils";
import { IoAddOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { k8sDefinitions } from "./data/definitions";
import { getLastWord } from "./UtilityFunctions/utils";

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
// Define the type with properties
interface DefinitionWithProperties {
  description: string;
  properties: { [key: string]: any };
  required: string[];
  type: string;
}

// Type guard function
function hasProperties(
  kindDef: any
): kindDef is { properties: { [key: string]: any } } {
  return "properties" in kindDef;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

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
              <div className="flex items-center gap-5">
                {isObject ? (
                  <button
                    className="flex items-center gap-2 text-sm font-medium hover:text-hoverColor text-white"
                    onClick={() => toggleExpand(currentPath)}
                  >
                    {isExpanded ? (
                      <IoIosArrowDown className="h-3 w-3" />
                    ) : (
                      <IoIosArrowForward className="h-3 w-3" />
                    )}
                  </button>
                ) : isNumber ? (
                  <input
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
                    type="text"
                    value={value === null ? "" : value}
                    onChange={(e) =>
                      handleInputChange(index, currentPath, e.target.value)
                    }
                    className="input block w-full rounded-md"
                  />
                )}
                <label
                  onClick={() => toggleExpand(currentPath)}
                  className="block text-sm font-medium text-white hover:text-hoverColor"
                >
                  {key}
                </label>
              </div>
              <div
                onClick={toggleModal}
                className="flex items-center justify-center gap-1 text-xs font-medium text-white hover:text-hoverColor bg-backgrounColor2 py-2 px-3 rounded-lg"
              >
                <IoAddOutline className="h-4 w-4" /> <span>Add</span>
              </div>
            </div>
            {isModalOpen && (
              <div
                onClick={handleOverlayClick}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div
                  className="bg-backgroundColor rounded-lg p-6 relative"
                  style={{ width: "400px", height: "400px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center w-full h-full gap-4 relative">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                          console.log("SearchTerm Updated:", e.target.value);
                          setSearchTerm(e.target.value);
                        }}
                        className="text-gray-400 bg-backgrounColor2 w-full rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-10"
                      />
                      <div className="absolute inset-y-0 right-2 flex items-center pr-3">
                        <CiCircleRemove
                          className="h-5 w-5 text-primaryColor cursor-pointer"
                          onClick={() => setSearchTerm("")}
                        />
                      </div>
                    </div>
                    <div className="overflow-auto w-full h-full">
                      <div className="mt-2 bg-backgrounColor2 rounded-lg shadow-lg w-full">
                        <ul className="max-h-64 overflow-y-auto">
                          {Object.entries(k8sDefinitions).map(
                            ([kindKey, kindDef]) => {
                              const lastKindPart = getLastWord(kindKey);
                              const objKind = obj.kind || ""; // Ensure obj.kind is not undefined

                              console.log(
                                "KindKey:",
                                kindKey,
                                "LastKindPart:",
                                lastKindPart,
                                "ObjKind:",
                                objKind
                              );

                              if (
                                objKind === lastKindPart &&
                                hasProperties(kindDef)
                              ) {
                                const filteredProperties = Object.keys(
                                  kindDef.properties
                                ).filter((prop) =>
                                  prop
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                );

                                console.log(
                                  "FilteredProperties:",
                                  filteredProperties
                                );

                                return filteredProperties.length > 0 ? (
                                  filteredProperties.map((prop) => (
                                    <li
                                      key={prop}
                                      className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-700"
                                    >
                                      <span>{prop}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-4 py-3 text-sm text-gray-500">
                                    No matching properties
                                  </li>
                                );
                              }
                              return null;
                            }
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isObject && isExpanded && (
              <div className="ml-6">
                {renderInputs(value, index, currentPath)}
              </div>
            )}
          </div>
        );
      })
      .filter((element): element is JSX.Element => element !== null);
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
