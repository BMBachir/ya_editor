// useMultiTabEditor.ts
import { useState, useEffect } from "react";

interface Tab {
  id: number;
  title: string;
  content: string;
}

const useMultiTabEditor = (
  initialYamlValue: string,
  setYamlValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: "Tab 1", content: initialYamlValue },
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [nextTabId, setNextTabId] = useState<number>(2);

  useEffect(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    if (activeTabContent !== undefined) {
      setYamlValue(activeTabContent);
    }
  }, [activeTab, tabs, setYamlValue]);

  const addTab = () => {
    // Save current active tab's content before adding a new tab
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              content: tabs.find((t) => t.id === activeTab)?.content || "",
            }
          : tab
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
    // Save current active tab's content before switching
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              content: tabs.find((t) => t.id === activeTab)?.content || "",
            }
          : tab
      )
    );

    setActiveTab(id);
  };

  const updateTabContent = (value: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab ? { ...tab, content: value } : tab
      )
    );

    // Update yamlValue for display in parent component
    setYamlValue(value);
  };

  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);

    if (activeTab === id && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
      setYamlValue(updatedTabs[0].content);
    } else if (updatedTabs.length === 0) {
      setYamlValue("");
    }
  };

  return {
    tabs,
    activeTab,
    addTab,
    handleTabChange,
    updateTabContent,
    removeTab,
  };
};

export default useMultiTabEditor;
