// components/YamlEditor.tsx
"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { useYamlContext } from "./context/YamlContext";
import YamlJsonToggle from "./YamlJsonToggle";
import FileUpload from "./FileUpload";
import ResourceEditor from "./ResourceEditor";
import NavBar from "./NavBar";
import Stepper from "./Stepper";
import SearchBar from "./SearchBar";

const YamlEditor: React.FC = () => {
  const { yamlValue, handleEditorChange } = useYamlContext();

  return (
    <div className="flex bg-gray-900">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ml-64">
        <div className="flex-1 bg-gray-800 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <div className="container">
              <div className="mt-24 flex flex-col items-center gap-5 mb-10">
                <Stepper />
              </div>
              <div className="flex flex-col md:flex-row flex-1">
                <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 h-[720px] overflow-auto">
                  <SearchBar />

                  <ResourceEditor />
                </div>
                <div className="flex-1 ml-7 bg-gray-800">
                  <div className="flex flex-col items-center justify-center">
                    <CodeMirror
                      value={yamlValue}
                      height="680px"
                      theme={oneDark}
                      extensions={[yaml()]}
                      onChange={handleEditorChange}
                      className="w-full"
                    />
                    <div className="mt-4 flex items-center justify-center gap-5">
                      <FileUpload />
                      <YamlJsonToggle />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YamlEditor;
