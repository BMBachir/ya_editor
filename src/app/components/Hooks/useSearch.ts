"use client";
import { useState } from "react";
import { simpleSchemas } from "../data/schemas";
import { getLastWord } from "../UtilityFunctions/utils";

export const useSearch = (
  handleAddResource: (resourceType: string) => void
) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const schemas = Object.keys(simpleSchemas);

  const SimpleSchemas = schemas.filter((schema) =>
    schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleAddResource(suggestion);
  };

  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handleSearchShow = () => {
    setShowSearch(!showSearch);
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
