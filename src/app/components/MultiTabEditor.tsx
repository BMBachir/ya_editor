import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { IoAddOutline, IoClose } from "react-icons/io5";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

interface Tab {
  id: number;
  title: string;
  content?: string;
}

interface TabState {
  id: number;
  title: string;
  value?: string;
}

interface MultiTabEditorProps {
  yamlValues: Tab[];
  tabs: TabState[];
  activeTab: number;
  addTab: () => void;
  handleTabChange: (id: number) => void;
  removeTab: (id: number) => void;
  updateTabContent: (id: number, content: string) => void;
  handleEditorChange: (id: number, newValue: string) => void;
}

const MultiTabEditor: React.FC<MultiTabEditorProps> = ({
  tabs,
  activeTab,
  addTab,
  handleTabChange,
  removeTab,
  handleEditorChange,
}) => {
  const valueActiveTab = tabs.find((tab) => tab.id === activeTab)?.value || "";

  return (
    <div className="p-4 bg-backgroundColor2">
      <div className="p-2 bg-backgroundColor2 overflow-auto">
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
        value={valueActiveTab}
        height="680px"
        theme={githubDarkInit({
          settings: {
            gutterBackground: "#05141C",
            background: "#05141C",
            fontSize: "19px",
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
        className="w-full"
        lang="yaml"
        onChange={(value) => {
          handleEditorChange(activeTab, value);
        }}
      />
    </div>
  );
};

export default MultiTabEditor;
