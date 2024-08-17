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
  const [tabs, setTabs] = useState([{ id: 1, title: "Tab 1", content: "" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [nextTabId, setNextTabId] = useState(2); // Track the next tab ID

  const addTab = () => {
    const newTab = {
      id: nextTabId,
      title: `Tab ${nextTabId}`,
      content: "",
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setNextTabId(nextTabId + 1); // Increment the ID for the next tab
  };

  const handleTabChange = (id: number) => {
    setActiveTab(id);
  };

  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (activeTab === id && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id); // Set the first tab as active if current is removed
    }
  };

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
            <div className="p-4 bg-backgrounColor2  overflow-auto ">
              {/* Tabs Header */}
              <div className="flex items-center justify-start border-gray-300">
                <div className="flex ">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`relative flex items-center py-2 px-4 mx-1 rounded-lg transition-colors duration-300 ${
                        tab.id === activeTab
                          ? "bg-backgroundColor text-gray-200 shadow-md"
                          : "bg-backgroundColor text-gray-200 hover:bg-[#121f2b]"
                      }`}
                    >
                      <button
                        className="flex-1"
                        onClick={() => handleTabChange(tab.id)}
                      >
                        {tab.title}
                      </button>
                      {tab.id === activeTab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primaryColor bg-opacity-50 rounded-b-lg"></div>
                      )}
                      {tabs.length > 1 && (
                        <button
                          className="ml-2 p-1 text-gray-400 hover:bg-gray-500 hover:bg-opacity-25 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTab(tab.id);
                          }}
                        >
                          <IoClose className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  className="py-1 px-1 ml-2 rounded-full bg-primaryColor bg-opacity-25 text-white shadow-md hover:bg-primaryColor hover:bg-opacity-50 transition-colors duration-300"
                  onClick={addTab}
                >
                  <IoAddOutline className="h-5 w-5" />
                </button>
              </div>
            </div>

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
