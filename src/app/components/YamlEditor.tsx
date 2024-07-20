"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { draculaInit } from "@uiw/codemirror-theme-dracula";
import { parseAllDocuments } from "yaml";
import NavBar from "./NavBar";
import Stepper from "./Stepper";
import { useYamlEditorState } from "./Hooks/useYamlEditorState";
import { useResourceManagement } from "./Hooks/useResourceManagement";
import { useSearch } from "./Hooks/useSearch";
import ResourceEditor from "./ResourceEditor";
import FileUpload from "./FileUpload";
import YamlJsonToggle from "./YamlJsonToggle";
import SearchBar from "./SearchBar";
import { tags as t } from "@lezer/highlight";

const YamlEditor: React.FC = () => {
  const {
    yamlValue,
    setYamlValue,
    jsonObjects,
    setJsonObjects,
    isYamlToJson,
    setIsYamlToJson,
    fileInputRef,
    handleFileChange,
    handleYamlToJson,
    handleJsonToYaml,
    handleClearYaml,
    handleEditorChange,
  } = useYamlEditorState();

  const {
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    handleKeyChange,
  } = useResourceManagement(setYamlValue, setJsonObjects);

  const {
    searchTerm,
    showSearch,
    handleSearchChange,
    setShowSuggestions,
    handleSuggestionClick,
    handleSearchShow,
    showSuggestions,
    handleClearSearch,
    filteredSuggestions,
  } = useSearch((resourceType: string) => {
    handleAddResource(resourceType);
  });

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-backgroundColor text-white">
            <div className="mt-16">
              <Stepper />
            </div>
            <div className="flex flex-col md:flex-row flex-1 mt-7">
              {/* Left Column */}
              <div className="bg-backgroundColor p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <SearchBar
                    handleClearSearch={handleClearSearch}
                    setShowSuggestions={setShowSuggestions}
                    handleClearYaml={handleClearYaml}
                    searchTerm={searchTerm}
                    showSearch={showSearch}
                    handleSearchChange={handleSearchChange}
                    handleSearchShow={handleSearchShow}
                    showSuggestions={showSuggestions}
                    filteredSuggestions={filteredSuggestions}
                    handleSuggestionClick={handleSuggestionClick}
                  />
                </div>

                <div id="jsonInputs" className="flex flex-col gap-4">
                  <ResourceEditor
                    jsonObjects={jsonObjects}
                    expandedResourceIndex={expandedResourceIndex}
                    toggleKindVisibility={toggleKindVisibility}
                    handleDeleteResource={handleDeleteResource}
                    handleInputChange={handleInputChange}
                    handleKeyChange={handleKeyChange}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 ml-4 bg-backgrounColor2 p-4 flex flex-col items-center rounded-md">
                <div className="flex flex-col items-center w-full">
                  <CodeMirror
                    value={yamlValue}
                    height="680px"
                    theme={draculaInit({
                      settings: {
                        gutterBackground: "#05141C",
                        background: "#05141C",
                        fontSize: "15px",
                        caret: "#c6c6c6",
                        fontFamily: "monospace",
                      },
                      styles: [{ tag: t.keyword, color: "#FFAB70" }],
                    })}
                    extensions={[yaml()]}
                    onChange={handleEditorChange}
                    className="w-full"
                    lang="yaml"
                  />
                  <div className="flex items-center justify-center gap-5 mt-6">
                    <FileUpload
                      fileInputRef={fileInputRef}
                      handleFileChange={handleFileChange}
                    />
                    <YamlJsonToggle
                      isYamlToJson={isYamlToJson}
                      setIsYamlToJson={setIsYamlToJson}
                      handleYamlToJson={handleYamlToJson}
                      handleJsonToYaml={handleJsonToYaml}
                    />
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
