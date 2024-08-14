import React from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { isNumberKey } from "./UtilityFunctions/utils";

interface RenderInputsProps {
  obj: any;
  index: number;
  path?: string;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  handleInputChange: (index: number, path: string, newValue: any) => void;
  handleAddRefProp: (
    resourceIndex: number,
    selectedKey: string,
    refProp: string
  ) => void;
  handleAddClick: (key: string) => void;
}

const RenderInputs: React.FC<RenderInputsProps> = ({
  obj,
  index,
  path = "",
  expandedPaths,
  toggleExpand,
  handleInputChange,
  handleAddRefProp,
  handleAddClick,
}) => {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }

  return (
    <>
      {Object.keys(obj).map((key) => {
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
            {isObject && isExpanded && (
              <div className="ml-6">
                <RenderInputs
                  obj={value}
                  index={index}
                  path={currentPath}
                  expandedPaths={expandedPaths}
                  toggleExpand={toggleExpand}
                  handleInputChange={handleInputChange}
                  handleAddRefProp={handleAddRefProp}
                  handleAddClick={handleAddClick}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default RenderInputs;
