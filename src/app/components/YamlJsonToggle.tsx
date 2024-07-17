// components/YamlJsonToggle.tsx
import React from "react";
import { GiCardExchange } from "react-icons/gi";
import { useYamlContext } from "./context/YamlContext";

const YamlJsonToggle: React.FC = () => {
  const { isYamlToJson, handleYamlToJson, handleJsonToYaml, toggleConvert } =
    useYamlContext();

  return (
    <div className="flex items-center justify-center gap-5">
      {isYamlToJson ? (
        <button
          className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
          onClick={() => {
            handleYamlToJson();
            toggleConvert();
          }}
        >
          <GiCardExchange className="h-5 w-5" />
          YAML to JSON
        </button>
      ) : (
        <button
          className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
          onClick={() => {
            handleJsonToYaml();
            toggleConvert();
          }}
        >
          <GiCardExchange className="h-5 w-5" />
          JSON to YAML
        </button>
      )}
    </div>
  );
};

export default YamlJsonToggle;
