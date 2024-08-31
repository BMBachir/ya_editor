"use client";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
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
import { githubDark, githubDarkInit } from "@uiw/codemirror-theme-github";
import Split from "react-split";
import { IoAddOutline, IoClose } from "react-icons/io5";
import MultiTabEditor from "./MultiTabEditor";
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
    handleAddRefProp,
    handleDeleteLabel,
  } = useYamlEditorState();

  const {
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    filterPropertiesRecursively,
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
    SimpleSchemas,
  } = useSearch((resourceType: string) => {
    handleAddResource(resourceType);
  });

  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ">
        <Split
          className=" custom-split flex flex-1 "
          sizes={[33, 67]}
          minSize={200}
          gutterSize={10}
          cursor="col-resize"
        >
          {/* Left Column */}
          <div className="bg-backgroundColor p-6 flex flex-col gap-6 overflow-auto">
            <SearchBar
              handleClearSearch={handleClearSearch}
              setShowSuggestions={setShowSuggestions}
              handleClearYaml={handleClearYaml}
              searchTerm={searchTerm}
              showSearch={showSearch}
              handleSearchChange={handleSearchChange}
              handleSearchShow={handleSearchShow}
              showSuggestions={showSuggestions}
              SimpleSchemas={SimpleSchemas}
              handleSuggestionClick={handleSuggestionClick}
            />

            <div id="jsonInputs" className="flex flex-col gap-4">
              <ResourceEditor
                jsonObjects={jsonObjects}
                expandedResourceIndex={expandedResourceIndex}
                toggleKindVisibility={toggleKindVisibility}
                handleDeleteResource={handleDeleteResource}
                handleInputChange={handleInputChange}
                handleAddRefProp={handleAddRefProp}
                handleDeleteLabel={handleDeleteLabel}
                filterPropertiesRecursively={filterPropertiesRecursively}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="p-4 bg-backgrounColor2  ">
            <MultiTabEditor yamlValue={yamlValue} setYamlValue={setYamlValue} />
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
        </Split>
      </div>
    </div>
  );
};

export default YamlEditor;
