import { useState, useEffect } from "react";

interface Tab {
  id: number;
  title: string;
  content?: string; // Each tab manages its own content
}

interface TabState {
  id: number;
  title: string;
  value?: string; // Value to hold content for editors
}

const useMultiTabEditor = (
  yamlValues: Tab[],
  setYamlValue: (tabId: number, title: string, value: string) => void
) => {
  /* State variables */
  const [tabs, setTabs] = useState<TabState[]>([
    { id: 1, title: "Tab 1", value: yamlValues[0]?.content || "" },
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [nextTabId, setNextTabId] = useState<number>(2);

  /* Functions */

  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);

    // Check if the removed tab was active and update activeTab accordingly
    if (activeTab === id && updatedTabs.length > 0) {
      const newActiveTab = updatedTabs[0].id; // Set the first remaining tab as active
      setActiveTab(newActiveTab);
      const newActiveTabContent = updatedTabs[0].value || "";
      setYamlValue(newActiveTab, updatedTabs[0].title, newActiveTabContent);
    } else if (updatedTabs.length === 0) {
      setActiveTab(1); // Reset to first tab if no tabs left
      setYamlValue(1, "Tab 1", ""); // Clear value if no tabs left
    }
  };

  /* Update YAML value when active tab changes */
  useEffect(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.value;
    if (activeTabContent !== undefined) {
      setYamlValue(activeTab, `Tab ${activeTab}`, activeTabContent);
    }
  }, []);

  const addTab = () => {
    // Save current active tab's content before adding a new tab
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              value: tabs.find((t) => t.id === activeTab)?.value || "", // Save current content
            }
          : tab
      )
    );

    const newTab: Tab = {
      id: nextTabId,
      title: `Tab ${nextTabId}`,
      content: "", // Initially empty content
    };

    setTabs((prevTabs) => [...prevTabs, { ...newTab, value: "" }]); // Add new tab
    setActiveTab(nextTabId); // Switch to the new tab
    setNextTabId(nextTabId + 1); // Increment next tab ID
    setYamlValue(nextTabId, `Tab ${nextTabId}`, ""); // Initialize new tab's value
  };

  const handleTabChange = (id: number) => {
    // Save current active tab's content before switching
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              value: tabs.find((t) => t.id === activeTab)?.value || "", // Save current content
            }
          : tab
      )
    );

    setActiveTab(id); // Switch to the new tab
  };

  // Handle content changes in the active tab
  const updateTabContent = (id: number, content: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, value: content } : tab))
    );
  };

  return {
    tabs,
    setTabs,
    activeTab,
    addTab,
    handleTabChange,
    removeTab,
    updateTabContent, // Export function to update content
  };
};

export default useMultiTabEditor;
