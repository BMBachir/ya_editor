// components/ResourceEditor.tsx
import React from "react";
import { useYamlContext } from "./context/YamlContext";
import { LuDelete } from "react-icons/lu";
import { FcDeleteRow } from "react-icons/fc";
const ResourceEditor: React.FC = () => {
  const {
    jsonObjects,
    expandedResourceIndex,
    toggleKindVisibility,
    renderInputs,
    handleDeleteResource,
  } = useYamlContext();

  return (
    <div id="jsonInputs" className="flex flex-col gap-4">
      {jsonObjects.map((obj, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleKindVisibility(index)}
          >
            <h3 className="text-lg font-medium mb-2">
              Kind: {obj.kind || "Unknown"}
            </h3>
            <button className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm">
              <LuDelete className="h-5 w-5" />
            </button>
            <span>{expandedResourceIndex === index ? "-" : "+"}</span>
          </div>
          {expandedResourceIndex === index && (
            <div className="rounded-md">
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
