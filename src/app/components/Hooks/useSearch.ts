"use client";
import { useState } from "react";
import { simpleSchemas } from "../data/schemas";
import { k8sDefinitions } from "../data/definitions";
export const useSearch = (
  handleAddResource: (resourceType: string) => void
) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const schemas = Object.keys(simpleSchemas);

  const SimpleSchemas = schemas.filter((schema) =>
    schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      resource.properties
    );
  });

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
