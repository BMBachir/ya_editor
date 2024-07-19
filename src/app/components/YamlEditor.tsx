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
    setExpandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
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
            <div className="flex flex-col p-4">
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
              <div className="flex flex-col mt-4 flex-1">
                <CodeMirror
                  value={yamlValue}
                  height="60vh"
                  theme={oneDark}
                  extensions={[yaml()]}
                  onChange={(value) => setYamlValue(value)}
                />
              </div>

              <div className="mt-4">
                <ResourceEditor
                  jsonObjects={jsonObjects}
                  expandedResourceIndex={expandedResourceIndex}
                  toggleKindVisibility={toggleKindVisibility}
                  handleDeleteResource={handleDeleteResource}
                  setYamlValue={setYamlValue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YamlEditor;
