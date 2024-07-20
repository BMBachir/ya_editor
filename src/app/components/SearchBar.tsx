"use client";
import React, { ChangeEvent, useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    handleSearchShow();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-80 mb-3">
        <div className="flex">
          <h2 className="text-xl font-semibold">Edit from inputs</h2>
        </div>

        <div className="flex-1">
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
              onClick={toggleModal}
            >
              {showSearch ? (
                <IoRemove className="h-6 w-6" />
              ) : (
                <IoAdd className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-backgroundColor rounded-lg p-6 relative"
            style={{
              width: "400px",
              height: "400px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click events from propagating to the overlay
          >
            <div className="flex flex-col items-center w-full h-full gap-4 relative">
              <div className="relative w-full">
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
                  <div className="absolute inset-y-0 right-2 flex items-center pr-3">
                    <CiCircleRemove
                      className="h-5 w-5 text-primaryColor cursor-pointer"
                      onClick={handleClearSearch}
                    />
                  </div>
                )}
              </div>
              {filteredSuggestions.length > 0 && (
                <div className="mt-2 bg-gray-900 rounded-lg shadow-lg w-full">
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
        </div>
      )}
    </>
  );
};

export default SearchBar;
