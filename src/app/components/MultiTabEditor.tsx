import React from "react";
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
  setYamlValue: React.Dispatch<React.SetStateAction<string>>; // Function to update YAML value in parent
  tabs: Tab[]; // Array of tabs
  activeTab: number; // Currently active tab ID
  addTab: () => void; // Function to add a new tab
  handleTabChange: (id: number) => void; // Function to change active tab
  updateTabContent: (value: string) => void; // Function to update content of the active tab
  removeTab: (id: number) => void; // Function to remove a tab
}

const MultiTabEditor: React.FC<MultiTabEditorProps> = ({
  yamlValue,
  setYamlValue,
  tabs,
  activeTab,
  addTab,
  handleTabChange,
  updateTabContent,
  removeTab,
}) => {
  return (
    <div className="p-4 bg-backgrounColor2">
      <div className="p-2 bg-backgrounColor2 overflow-auto">
        <div className="flex items-center justify-start border-gray-300">
          <div className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center py-2 px-4 mx-1 rounded-lg transition-colors duration-300 ${
                  tab.id === activeTab
                    ? "bg-backgroundColor text-gray-200 shadow-md"
                    : "bg-backgroundColor text-gray-200 hover:bg-[#121f2b]"
                }`}
              >
                <button className="flex-1">{tab.title}</button>
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
          updateTabContent(value);
        }}
        className="w-full"
        lang="yaml"
      />
    </div>
  );
};

export default MultiTabEditor;
