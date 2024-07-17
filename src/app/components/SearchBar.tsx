// components/SearchBar.tsx
"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoAdd, IoRemove } from "react-icons/io5";
import { useYamlContext } from "./context/YamlContext";
import { getLastWord } from "./UtilityFunctions/utils";
import { k8sDefinitions } from "./data/definitions";
import { MdDeleteOutline } from "react-icons/md";
const SearchBar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    showSuggestions,
    setShowSuggestions,
    handleSuggestionClick,
    setYamlValue,
    setJsonObjects,
  } = useYamlContext();

  const [ShowSearch, SetShowSearch] = useState(false);

  const handleSearchShow = () => {
    SetShowSearch(!ShowSearch);
  };
  const handleClearYaml = () => {
    setYamlValue("");
    setJsonObjects([]);
  };

  interface Resource {
    description: string;
    properties?: Record<string, any>;
  }

  const kinds = Object.keys(k8sDefinitions) as (keyof typeof k8sDefinitions)[];

  const filteredSuggestions = kinds.filter((kind) => {
    const resource = k8sDefinitions[
      kind as keyof typeof k8sDefinitions
    ] as Resource;
    return (
      kind.toLowerCase().includes(searchTerm.toLowerCase()) &&
      resource.properties &&
      "kind" in resource.properties
    );
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit from inputs</h2>

        <div className="flex items-center gap-6">
          <button
            className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm"
            onClick={handleClearYaml}
          >
            <MdDeleteOutline className="h-5 w-5" />
          </button>
          {!ShowSearch ? (
            <button
              className="text-green-500 hover:text-green-600 font-semibold rounded-md shadow-sm"
              onClick={handleSearchShow}
            >
              <IoAdd className="h-5 w-5" />
            </button>
          ) : (
            <button
              className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm"
              onClick={handleSearchShow}
            >
              <IoRemove className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {ShowSearch && (
        <div className="flex items-center justify-center w-full flex-wrap md:flex-nowrap gap-4">
          <div className="w-full max-w-md top-4 ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                className=" text-gray-400 bg-gray-900 w-full rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-10  "
              />
              <div className="text-gray-400 absolute inset-y-0 right-0 flex items-center pr-3">
                <FaSearch className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="mt-2 bg-gray-900 rounded-lg shadow-lg">
                <ul className="max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-700 "
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col ">
                          <span>{getLastWord(suggestion)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
