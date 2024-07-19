"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import NavBar from "./NavBar";
import Stepper from "./Stepper";
import { useYamlEditorState } from "./Hooks/useYamlEditorState";
import { useResourceManagement } from "./Hooks/useResourceManagement";
import { useSearch } from "./Hooks/useSearch";
import ResourceEditor from "./ResourceEditor";
import FileUpload from "./FileUpload";
import YamlJsonToggle from "./YamlJsonToggle";
import SearchBar from "./SearchBar";

const YamlEditor: React.FC = () => {
  const {
    yamlValue,
    setYamlValue,
    isYamlToJson,
    setIsYamlToJson,
    fileInputRef,
    handleFileChange,
    handleYamlToJson,
    handleJsonToYaml,
    handleClearYaml,
  } = useYamlEditorState();

  const {
    jsonObjects,
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    handleKeyChange,
  } = useResourceManagement(setYamlValue);

  const {
    searchTerm,
    showSearch,
    handleSearchChange,
    setShowSuggestions,
    handleSuggestionClick,
    handleSearchShow,
    showSuggestions,
    filteredSuggestions,
    handleClearSearch,
  } = useSearch(handleAddResource);

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-backgroundColor text-white">
            <Stepper />
            <div className="flex flex-col md:flex-row flex-1">
              {/* Left Column */}
              <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 h-screen overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-5">
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
              <div className="flex-1 ml-4 bg-gray-800 p-4 flex flex-col items-center h-screen overflow-auto">
                <div className="flex flex-col items-center w-full">
                  <CodeMirror
                    value={yamlValue}
                    height="680px"
                    theme={oneDark}
                    extensions={[yaml()]}
                    onChange={(value) => setYamlValue(value)}
                    className="w-full"
                  />
                  <div className="mt-16 ">
                    <div className="flex items-center justify-center gap-5">
                      <div className="relative w-[130px] h-[50px]">
                        <FileUpload
                          fileInputRef={fileInputRef}
                          handleFileChange={handleFileChange}
                        />
                      </div>
                      <div className="mb-12">
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
      </div>
    </div>
  );
};

export default YamlEditor;
