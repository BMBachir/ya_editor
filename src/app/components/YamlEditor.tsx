"use client";
import React, { useState } from "react";
import NavBar from "./NavBar";
import { useYamlEditorState } from "./Hooks/useYamlEditorState";
import { useResourceManagement } from "./Hooks/useResourceManagement";
import { useSearch } from "./Hooks/useSearch";
import ResourceEditor from "./ResourceEditor";
import FileUpload from "./FileUpload";
import YamlJsonToggle from "./YamlJsonToggle";
import SearchBar from "./SearchBar";
import Split from "react-split";
import MultiTabEditor from "./MultiTabEditor";
import useMultiTabEditor from "./Hooks/useMultiTabEditor";

const YamlEditor: React.FC = () => {
  interface Tab {
    id: number;
    title: string;
    content?: string;
  }
  const [yamlValues, setYamlValues] = useState<Tab[]>([
    { id: 1, title: "", content: "" },
  ]);
  // Function to set YAML value for a specific tab
  const setYamlValue = (tabId: number, title: string, value: string) => {
    setYamlValues((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, title: title, content: value } : tab
      )
    );
  };

  const {
    tabs,
    setTabs,
    activeTab,
    addTab,
    handleTabChange,
    removeTab,
    updateTabContent,
  } = useMultiTabEditor(yamlValues, setYamlValue);
  const {
    jsonObjects,
    setJsonObjects,
    isYamlToJson,
    setIsYamlToJson,
    fileInputRef,
    handleFileChange,
    //handleYamlToJson,
    //handleJsonToYaml,
    handleDeleteLabel,
    handleClearYaml,
    handleEditorChange,
    handleAddRefProp,
  } = useYamlEditorState(activeTab, tabs, setTabs, yamlValues, setYamlValue);

  const {
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    filterPropertiesRecursively,
  } = useResourceManagement(setYamlValue, setJsonObjects, activeTab, setTabs);

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
            <MultiTabEditor
              tabs={tabs}
              activeTab={activeTab}
              addTab={addTab}
              handleTabChange={handleTabChange}
              removeTab={removeTab}
              yamlValues={yamlValues}
              updateTabContent={updateTabContent}
              handleEditorChange={handleEditorChange}
            />
            <div className="flex items-center justify-center gap-5 mt-6">
              {/**   <FileUpload
                fileInputRef={fileInputRef}
                //handleFileChange={handleFileChange}
              />
              <YamlJsonToggle
                isYamlToJson={isYamlToJson}
                setIsYamlToJson={setIsYamlToJson}
                //handleYamlToJson={handleYamlToJson}
                //handleJsonToYaml={handleJsonToYaml}
              /> */}
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default YamlEditor;
