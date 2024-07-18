// components/ResourceEditor.tsx
import React from "react";
import { useYamlContext } from "./context/YamlContext";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
const ResourceEditor: React.FC = () => {
  const {
    jsonObjects,
    expandedResourceIndex,
    toggleKindVisibility,
    renderInputs,
    handleDeleteResource,
  } = useYamlContext();

  return (
    <div
      id="jsonInputs"
      className="flex flex-col gap-4 transition-all duration-300"
    >
      {jsonObjects.map((obj, index) => (
        <div
          key={index}
          className="bg-gray-700 p-4 rounded-lg transition-all duration-1000"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleKindVisibility(index)}
          >
            <h3 className="text-lg font-medium mb-2">
              Kind: {obj.kind || "Unknown"}
            </h3>
            <div className="flex items-center justify-center gap-6 cursor-pointer">
              <button className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm">
                <MdDeleteOutline
                  onClick={() => handleDeleteResource(index)}
                  className="h-5 w-5"
                />
              </button>
              <span>
                {expandedResourceIndex === index ? (
                  <IoIosArrowDown className="h-4 w-4 text-primaryColor" />
                ) : (
                  <IoIosArrowForward className="h-4 w-4 text-primaryColor" />
                )}
              </span>
            </div>
          </div>
          {expandedResourceIndex === index && (
            <div className="rounded-md transition-all duration-1000">
              {renderInputs(obj, index)}
              <button
                className="btn bg-red-400 hover:bg-red-500 w-full mt-2"
                onClick={() => handleDeleteResource(index)}
              >
                Delete Resource
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResourceEditor;
