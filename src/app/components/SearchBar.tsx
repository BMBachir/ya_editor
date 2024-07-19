"use client";
import React, { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { IoAdd, IoRemove } from "react-icons/io5";
import { MdClearAll } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import { getLastWord } from "./UtilityFunctions/utils";

interface SearchBarProps {
  searchTerm: string;
  showSearch: boolean;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchShow: () => void;
  showSuggestions: boolean;
  filteredSuggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
  handleClearYaml: () => void;
  setShowSuggestions: (value: boolean) => void;
  handleClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  showSearch,
  handleSearchChange,
  setShowSuggestions,
  handleSearchShow,
  showSuggestions,
  filteredSuggestions,
  handleSuggestionClick,
  handleClearYaml,
  handleClearSearch,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit from inputs</h2>
        <div className="flex items-center gap-6">
          <button
            className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm"
            onClick={handleClearYaml}
          >
            <MdClearAll className="h-6 w-6" />
          </button>
          <button
            className={`text-${showSearch ? "red" : "green"}-500 hover:text-${
              showSearch ? "red" : "green"
            }-600 font-semibold rounded-md shadow-sm`}
            onClick={handleSearchShow}
          >
            {showSearch ? (
              <IoRemove className="h-6 w-6" />
            ) : (
              <IoAdd className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="flex items-center justify-center w-full flex-wrap md:flex-nowrap gap-4">
          <div className="w-full max-w-md top-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                className="text-gray-400 bg-gray-900 w-full rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-10"
              />

              {searchTerm && (
                <div className="absolute inset-y-0 right-1 flex items-center pr-3">
                  <CiCircleRemove
                    className="h-5 w-5 text-primaryColor cursor-pointer"
                    onClick={handleClearSearch}
                  />
                </div>
              )}
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="mt-2 bg-gray-900 rounded-lg shadow-lg">
                <ul className="max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-700"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      <span>{getLastWord(suggestion)}</span>
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
