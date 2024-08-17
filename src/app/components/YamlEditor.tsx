"use client";
import React from "react";
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
          sizes={[33, 67]} // Sizes for the left and right columns
          minSize={200} // Minimum size for each pane
          gutterSize={10} // Size of the gutter between panes
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
          <div className="p-4 bg-backgrounColor2 flex flex-col items-center ">
            <div className="flex flex-col items-center w-full">
              <CodeMirror
                value={yamlValue}
                height="680px"
                theme={githubDarkInit({
                  settings: {
                    gutterBackground: "#05141C",
                    background: "#05141C",
                    fontSize: "15px",
                    caret: "#c6c6c6",
                    fontFamily: "monospace",
                  },
                  styles: [
                    { tag: t.keyword, color: "#FFAB70" },
                    { tag: t.literal, color: "#C6C6C6" },
                    { tag: t.variableName, color: "#9CDCFE" },
                  ],
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
        </Split>
      </div>
    </div>
  );
};

export default YamlEditor;
