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
  handleInputChange: (
    resourceIndex: number,
    path: string,
    newValue: any
  ) => void;
  handleAddRefProp: (
    resourceIndex: number,
    selectedKey: string,
    refProp: string
  ) => void;
}

interface Property {
  description: string;
  type: string;
  $ref?: string; // Assuming $ref is optional
}

interface KindDefinition {
  properties: {
    [key: string]: Property; // Index signature for properties
  };
  // Other fields...
}

function hasProperties(
  kindDef: any
): kindDef is { properties: { [key: string]: any } } {
  return "properties" in kindDef && typeof kindDef.properties === "object";
}

interface Property {
  description: string;
  type: string;
  $ref?: string;
}

interface KindDefinition {
  properties: {
    [key: string]: Property;
  };
  required?: string[];
  type: string;
}

const ResourceEditor: React.FC<ResourceEditorProps> = ({
  jsonObjects,
  expandedResourceIndex,
  toggleKindVisibility,
  handleDeleteResource,
  handleInputChange,
  handleAddRefProp,
}) => {
  const [activeTab, setActiveTab] = useState<{ [key: number]: string }>({});
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [nestedProperties, setNestedProperties] = useState<string[]>([]);
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

  const filterPropertiesRecursively = (
    obj: any,
    searchTerm: string,
    path = ""
  ): string[] => {
    const result: string[] = [];

    if (typeof obj === "object" && obj !== null) {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        // Check if the key matches the search term
        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          result.push(currentPath);
        }

        // Recursively search within nested objects
        if (typeof value === "object") {
          const nestedResults = filterPropertiesRecursively(
            value,
            searchTerm,
            currentPath
          );
          if (nestedResults.length > 0) {
            result.push(...nestedResults);
          }
        }
      }
    }

    return result;
  };

  const handleAddClick = (key: string) => {
    setSelectedKey(key);
    setNestedProperties([]);
    toggleModal();
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
          <div
            key={inputKey}
            className="mb-2 flex flex-col transition-all duration-900"
          >
            <div className="flex items-center justify-between gap-5 mt-5 border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full">
              <div className="flex items-center gap-5">
                <label
                  onClick={() => toggleExpand(currentPath)}
                  className="block text-sm font-medium text-white hover:text-primaryColor transition-colors duration-500"
                >
                  {key}
                </label>
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
              </div>
              {isObject && (
                <div
                  onClick={() => handleAddClick(key)}
                  className="flex items-center justify-center gap-1 cursor-pointer text-xs font-medium text-white hover:text-primaryColor bg-backgroundColor py-2 px-3 rounded-lg transition-colors duration-500"
                >
                  <IoAddOutline className="h-4 w-4" /> <span>Add</span>
                </div>
              )}
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
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                      <div className="mt-2 bg-backgroundColor2 rounded-lg shadow-lg w-full">
                        <ul className="max-h-64 overflow-y-auto">
                          {Object.entries(k8sDefinitions).map(
                            ([kindKey, kindDef]) => {
                              const lastKindPart = getLastWord(kindKey);
                              const objKind = obj.kind || "";

                              if (
                                objKind === lastKindPart &&
                                hasProperties(kindDef)
                              ) {
                                // Type assertion to specify the type of kindDef
                                const kindDefTyped = kindDef as KindDefinition;

                                // Filter properties based on the selected key
                                const filteredProperties = selectedKey
                                  ? Object.keys(kindDefTyped.properties).filter(
                                      (prop) =>
                                        kindDefTyped.properties[prop].$ref &&
                                        prop === selectedKey
                                    )
                                  : Object.keys(kindDefTyped.properties).filter(
                                      (prop) =>
                                        kindDefTyped.properties[prop].$ref &&
                                        prop
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase())
                                    );

                                // Group refs based on properties
                                const refs: { [key: string]: string } = {};
                                filteredProperties.forEach((prop) => {
                                  const property =
                                    kindDefTyped.properties[prop];
                                  if (property?.$ref) {
                                    refs[prop] = property.$ref;
                                  }
                                });

                                return Object.keys(refs).length > 0 ? (
                                  Object.entries(refs).flatMap(
                                    ([prop, ref]) => {
                                      // Step 01: Clean the ref
                                      const cleanedRef = ref.replace(
                                        "#/definitions/",
                                        ""
                                      );

                                      // Step 02: Search for it in k8sDefinitions with type assertion
                                      const refDefinition = k8sDefinitions[
                                        cleanedRef as keyof typeof k8sDefinitions
                                      ] as {
                                        properties: {
                                          [key: string]: {
                                            description: string;
                                            type: string;
                                            $ref?: string;
                                          };
                                        };
                                      };

                                      // Step 03: Display each property in its own <li>
                                      return refDefinition
                                        ? Object.keys(
                                            refDefinition.properties
                                          ).map((refProp) => (
                                            <li
                                              key={refProp}
                                              className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-700"
                                              onClick={() =>
                                                handleAddRefProp(
                                                  index,
                                                  selectedKey,
                                                  refProp
                                                )
                                              }
                                            >
                                              <span>{refProp}</span>
                                            </li>
                                          ))
                                        : null;
                                    }
                                  )
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
        <div
          key={inputKey}
          className="mb-2 border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full "
        >
          <label className="block text-sm font-medium text-white">{key}</label>
          <div className="">
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

  return (
    <div>
      {jsonObjects.map((obj, index) => {
        const isExpanded = expandedResourceIndex === index;
        const tabs = ["Simple", "Advanced"];
        const kind = obj.kind || "";
        const name = obj.metadata.name || "";

        return (
          <div
            key={index}
            className=" border border-primaryColor border-opacity-5 bg-backgrounColor2 transition-all duration-900  shadow-md mb-4 rounded-md"
          >
            <div className="flex items-center justify-between p-2 px-4 border-b border-opacity-40 border-cyan-900 bg-backgrounColor1 transition-all duration-400">
              <button
                className="text-xs text-primaryColor font-medium uppercase bg-backgrounColor2 rounded-full py-1 px-3 flex items-center justify-center gap-2 hover:text-hoverColor transition-all duration-900"
                onClick={() => toggleKindVisibility(index)}
              >
                <span>{kind}</span>
                {isExpanded ? (
                  <IoIosArrowDown className="w-4 h-4" />
                ) : (
                  <IoIosArrowForward className="w-4 h-4" />
                )}
              </button>
              <div
                onClick={() => handleDeleteResource(index)}
                className="flex items-center justify-center gap-1 cursor-pointer text-primaryColor hover:text-red-500 transition-all duration-400"
              >
                <button className=" flex">
                  <MdDeleteOutline className="w-5 h-5" />
                </button>
                <span className="felx items-center text-xs ">DELETE</span>{" "}
              </div>
            </div>
            {isExpanded && (
              <div className="p-4 transition-all duration-1000">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primaryColor ">
                    {kind}
                  </h3>
                  <p className="text-sm text-gray-500">{name}</p>
                </div>
                <div className="tabs-container mb-4 ">
                  <div className="tabs flex space-x-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() =>
                          setActiveTab((prevTabs) => ({
                            ...prevTabs,
                            [index]: tab,
                          }))
                        }
                        className={`${
                          activeTab[index] === tab
                            ? "text-primaryColor font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                {activeTab[index] === "Simple" ? (
                  <div className="flex flex-col gap-4 h-[450px] overflow-auto transition-all duration-100 ease-in-out opacity-100">
                    {" "}
                    {renderSimpleView(obj, index)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 h-[450px] overflow-auto transition-all duration-100 ease-in-out opacity-100">
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
