import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { isNumberKey } from "./UtilityFunctions/utils";
import { IoAddOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { k8sDefinitions } from "./data/definitions";
import { getLastWord } from "./UtilityFunctions/utils";
import { simpleFields } from "./data/simpleFields ";
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
  handleDeleteLabel: (index: number, path: string, key: string) => void;
  filterPropertiesRecursively: (
    obj: any,
    searchTerm: string,
    path: string
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

const ResourceEditor: React.FC<ResourceEditorProps> = ({
  jsonObjects,
  expandedResourceIndex,
  toggleKindVisibility,
  handleDeleteResource,
  handleInputChange,
  handleAddRefProp,
  handleDeleteLabel,
  filterPropertiesRecursively,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [nestedProperties, setNestedProperties] = useState<string[]>([]);
  const [tab, setTab] = useState("Simple");
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
            className="mb-2 flex flex-col transition-all duration-900 mr-2"
          >
            <div className="flex items-center justify-between gap-5 mt-1  border border-opacity-30 hover:bg-backgroundColor border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full">
              <div className="flex items-center gap-5 w-full">
                <label
                  onClick={() => toggleExpand(currentPath)}
                  className="block text-sm font-medium text-white hover:text-primaryColor transition-colors duration-500 "
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
                  className="flex items-center justify-center gap-1 cursor-pointer text-xs font-medium text-white hover:text-primaryColor bg-backgroundColor hover:bg-backgrounColor2 py-2 px-3 rounded-lg transition-colors duration-500"
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
                                const kindDefTyped = kindDef as KindDefinition;

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
                                      const cleanedRef = ref.replace(
                                        "#/definitions/",
                                        ""
                                      );

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

                                      return refDefinition
                                        ? Object.keys(
                                            refDefinition.properties
                                          ).map((refProp) => (
                                            <li
                                              key={refProp}
                                              className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-700"
                                              onClick={() => {
                                                toggleModal();
                                                handleAddRefProp(
                                                  index,
                                                  selectedKey,
                                                  refProp
                                                );
                                              }}
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

  const renderSimpleView = (obj: any, index: number): JSX.Element[] => {
    const kind = obj.kind || "";
    const simpleFieldPaths = simpleFields[kind] || [];

    return simpleFieldPaths.map((path) => {
      const parts = path.split(".");
      let value = obj;
      let isObject = false;

      // Traverse the object to find the value at the specified path
      for (const part of parts) {
        if (value && typeof value === "object") {
          value = value[part];
          isObject = typeof value === "object" && value !== null;
        } else {
          value = "";
          break;
        }
      }

      const inputKey = `${index}-${path}`;
      const isNumber = isNumberKey(path);

      // Handling key-value pairs (e.g., metadata.labels)
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <div
            key={inputKey}
            className="mb-2 border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full"
          >
            <label className="block text-sm font-medium text-white mb-2">
              {parts[parts.length - 1]}
            </label>
            <div>
              {Object.entries(value).map(([key, val]) => (
                <div
                  key={`${inputKey}-${key}`}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={key}
                    className="input block w-1/2 rounded-md"
                    readOnly // Prevent editing the key directly
                  />
                  <input
                    type="text"
                    value={val === null ? "" : String(val)}
                    onChange={(e) =>
                      handleFieldChange(index, `${path}.${key}`, e.target.value)
                    }
                    className="input block w-1/2 rounded-md"
                  />
                  <MdDeleteOutline
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDeleteLabel(index, path, key)}
                    size={20}
                  />
                </div>
              ))}
              <button
                onClick={() => handleAddNewLabel(index, path)}
                className="mt-2 text-sm font-medium text-primaryColor bg-backgroundColor py-2 px-4 rounded-lg hover:text-gray-200"
              >
                + Add
              </button>
            </div>
          </div>
        );
      }

      // If no labels exist, show a button to add the first label
      if (path.endsWith("labels") && (!value || typeof value !== "object")) {
        return (
          <div
            key={inputKey}
            className="mb-2  border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full"
          >
            <label className="block text-sm font-medium text-white mb-2">
              {parts[parts.length - 1]}
            </label>
            <div>
              <button
                onClick={() => handleAddNewLabel(index, path)}
                className="mt-2 text-sm font-medium text-primaryColor bg-backgroundColor py-2 px-4 rounded-lg hover:text-white"
              >
                + Add
              </button>
            </div>
          </div>
        );
      }

      // Handling non-object fields
      return (
        <div
          key={inputKey}
          className="mb-2 border border-opacity-30 border-cyan-900 rounded-lg pl-4 pr-10 py-3 w-full"
        >
          <label className="block text-sm font-medium text-white mb-2">
            {parts[parts.length - 1]}
          </label>
          <div>
            {isObject ? (
              <div className="text-xs font-mono text-irisBlueColor">
                No items yet
              </div>
            ) : isNumber ? (
              <input
                id={`${inputKey}-value`}
                type="number"
                value={value === null ? "" : value}
                onChange={(e) =>
                  handleFieldChange(index, path, Number(e.target.value))
                }
                className="input block w-full rounded-md"
              />
            ) : (
              <input
                id={`${inputKey}-value`}
                type="text"
                value={value === null ? "" : String(value)}
                onChange={(e) => handleFieldChange(index, path, e.target.value)}
                className="input block w-full rounded-md"
              />
            )}
          </div>
        </div>
      );
    });
  };

  // Function to handle adding a new label
  const handleAddNewLabel = (index: number, path: string) => {
    const newLabelKey = prompt("Enter the key for the new label:");
    if (!newLabelKey) return;

    const updatedPath = `${path}.${newLabelKey}`;
    handleFieldChange(index, updatedPath, "");
  };

  const handleFieldChange = (index: number, path: string, newValue: any) => {
    const parts = path.split(".");
    const updatedObj = { ...jsonObjects[index] };

    let obj: any = updatedObj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] === undefined) {
        obj[parts[i]] = {}; // Create empty object if undefined
      }
      obj = obj[parts[i]];
    }

    obj[parts[parts.length - 1]] = newValue;

    handleInputChange(index, path, newValue);
  };

  return (
    <div>
      {jsonObjects.map((obj, index) => {
        const isExpanded = expandedResourceIndex === index;
        const kind = obj.kind || "";
        const name = obj.metadata.name || "";

        return (
          <div
            key={index}
            className=" border border-primaryColor border-opacity-5 bg-backgrounColor2 transition-all duration-900 hover:shadow-all-sides mb-4 rounded-md"
          >
            <div className="flex items-center justify-between p-2 px-4  bg-backgrounColor1 transition-all duration-400">
              <button
                className=" text-primaryColor font-medium  bg-backgrounColor2 rounded-full  py-1 px-3 flex items-center justify-center gap-6 hover:text-hoverColor transition-all duration-900"
                onClick={() => toggleKindVisibility(index)}
              >
                <div className=" flex-col ">
                  <h3 className="text-lg font-semibold ">{kind}</h3>
                  <p className="text-sm text-gray-500">{name}</p>
                </div>
              </button>
              <div className="flex items-center justify-center gap-1 cursor-pointer  ">
                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={() => handleDeleteResource(index)}
                    className=" hover:text-red-500 text-primaryColor transition-all duration-400"
                  >
                    <MdDeleteOutline className="w-5 h-5" />
                  </button>
                  <div
                    className="hover:text-hoverColor transition-all duration-400"
                    onClick={() => toggleKindVisibility(index)}
                  >
                    {isExpanded ? (
                      <IoIosArrowDown className="w-4 h-4" />
                    ) : (
                      <IoIosArrowForward className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isExpanded && (
              <div className="p-4 transition-all duration-1000 border-t border-opacity-40 border-cyan-900">
                <div className="tabs-container mb-4 ">
                  <div className="tabs  ">
                    <div className=" border-b border-solid border-cyan-900 ">
                      <button
                        onClick={() => setTab("Simple")}
                        className={` ${
                          tab === "Simple" &&
                          "border-b border-solid border-primaryColor "
                        } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold `}
                      >
                        Simple
                      </button>
                      <button
                        onClick={() => setTab("Advanced")}
                        className={` ${
                          tab === "Advanced" &&
                          "border-b border-solid border-primaryColor "
                        } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold  `}
                      >
                        Advanced
                      </button>
                    </div>

                    <div className=" ">
                      {tab === "Simple" && (
                        <div className="flex flex-col gap-4 mt-5 max-h-[450px] overflow-auto transition-all duration-100 ease-in-out opacity-100">
                          {" "}
                          {renderSimpleView(obj, index)}
                        </div>
                      )}
                      {tab === "Advanced" && (
                        <div className="flex flex-col gap-4 mt-5  max-h-[450px] overflow-auto transition-all duration-100 ease-in-out opacity-100">
                          {renderInputs(obj, index)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResourceEditor;
