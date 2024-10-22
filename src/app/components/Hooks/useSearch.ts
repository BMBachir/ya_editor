"use client";
import { useState } from "react";
import { simpleSchemas } from "../data/schemas";

export const useSearch = (
  handleAddResource: (resourceType: string) => void
) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false); // Toggles search bar

  const schemas = Object.keys(simpleSchemas);

  // Filter schemas based on search term
  const SimpleSchemas = schemas.filter((schema) =>
    schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowSuggestions(false);
    handleAddResource(suggestion);
  };

  const handleSearchShow = () => {
    setShowSearch(!showSearch); // Toggle search bar visibility
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return {
    searchTerm,
    showSearch,
    setSearchTerm,
    setShowSearch,
    showSuggestions,
    setShowSuggestions,
    handleSearchChange,
    handleSuggestionClick,
    handleSearchShow,
    SimpleSchemas,
    handleClearSearch,
  };
};
