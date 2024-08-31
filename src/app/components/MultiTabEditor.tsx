import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { IoAddOutline, IoClose } from "react-icons/io5";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

interface Tab {
  id: number;
  title: string;
  content: string; // Each tab manages its own content
}

interface MultiTabEditorProps {
  yamlValue: string; // Represents the content of the active tab or the combined content
  setYamlValue: (value: string) => void;
}

const MultiTabEditor: React.FC<MultiTabEditorProps> = ({
  yamlValue,
  setYamlValue,
}) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: "Tab 1", content: yamlValue }, // Initialize with yamlValue
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [nextTabId, setNextTabId] = useState<number>(2);

  useEffect(() => {
    // Load the content of the active tab into the global YAML state
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    if (activeTabContent !== undefined) {
      setYamlValue(activeTabContent);
    }
  }, [activeTab, tabs, setYamlValue]);

  const addTab = () => {
    // Save the current active tab's content before adding a new tab
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: yamlValue } : tab
      )
    );

    const newTab: Tab = {
      id: nextTabId,
      title: `Tab ${nextTabId}`,
      content: "", // New tab starts with empty content
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(nextTabId);
    setNextTabId(nextTabId + 1);
    setYamlValue(""); // Clear the editor content for the new tab
  };

  const handleTabChange = (id: number) => {
    // Save the current active tab's content before switching tabs
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: yamlValue } : tab
      )
    );
    setActiveTab(id); // Switch to the new tab
  };

  const updateTabContent = (value: string) => {
    // Update the content of the currently active tab in its own state
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: value } : tab
      )
    );
    // Update the global YAML state with the active tab's content
    setYamlValue(value);
  };

  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (activeTab === id && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
      setYamlValue(updatedTabs[0].content);
    } else if (updatedTabs.length === 0) {
      setYamlValue(""); // Clear YAML state if no tabs are left
    }
  };

  return (
    <div className="p-4 bg-backgrounColor2">
      <div className="p-2 bg-backgrounColor2 overflow-auto">
        <div className="flex items-center justify-start border-gray-300">
          <div className="flex">
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
        onChange={(value) => {
          updateTabContent(value); // Update the content in the current tab's state
        }}
        className="w-full"
        lang="yaml"
      />
    </div>
  );
};

export default MultiTabEditor;
