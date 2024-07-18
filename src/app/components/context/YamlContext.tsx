// context/YamlContext.tsx
"use client";
import React, { createContext, useContext, useState, useRef } from "react";
import { k8sDefinitions } from "../data/definitions";
import { IoIosAdd } from "react-icons/io";
import {
  isNumberKey,
  getDefaultForType,
  getLastWord,
  updateNestedObject,
  resolveRef,
} from "../UtilityFunctions/utils";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";

interface YamlContextProps {
  yamlValue: string;
  setYamlValue: (value: string) => void;
  jsonObjects: any[];
  setJsonObjects: (value: any[]) => void;
  expandedResourceIndex: number | null;
  setExpandedResourceIndex: (value: number | null) => void;
  isYamlToJson: boolean;
  setIsYamlToJson: (value: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleEditorChange: (newValue: string) => void;
  toggleKindVisibility: (index: number) => void;
  renderInputs: (obj: any, index: number, path?: string) => JSX.Element[];
  handleDeleteResource: (index: number) => void;
  handleYamlToJson: () => void;
  handleJsonToYaml: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleConvert: () => void;
}

const YamlContext = createContext<YamlContextProps | undefined>(undefined);

export const YamlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [yamlValue, setYamlValue] = useState<string>("");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);
  const [isYamlToJson, setIsYamlToJson] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(getLastWord(suggestion));
    setShowSuggestions(false);
    handleAddResource(suggestion);
  };

  const handleKeyChange = (index: number, oldPath: string, newKey: string) => {
    const editableMetadataKeys = [
      "metadata.name",
      "metadata.namespace",
      "metadata.labels",
      "metadata.annotations",
    ];
    const editableSpecKeys = [
      "spec.replicas",
      "spec.selector",
      "spec.template.metadata",
      "spec.template.metadata.labels",
      "spec.template.metadata.annotations",
      "spec.template.spec.containers",
      "spec.template.spec.containers.name",
      "spec.template.spec.containers.image",
      "spec.template.spec.containers.ports",
      "spec.template.spec.containers.resources",
      "spec.template.spec.containers.env",
      "spec.template.spec.containers.volumeMounts",
      "spec.ports",
      "spec.ports.port",
      "spec.ports.targetPort",
      "spec.ports.nodePort",
      "spec.ports.protocol",
      "data",
    ];

    if (
      !editableMetadataKeys.some((key) => oldPath.startsWith(key)) &&
      !editableSpecKeys.some((key) => oldPath.startsWith(key))
    ) {
      return;
    }

    setJsonObjects((prev) => {
      const updated = [...prev];
      const keys = oldPath.split(".");
      let current: any = updated[index];

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }

      const lastKey = keys[keys.length - 1];
      if (current.hasOwnProperty(lastKey)) {
        const value = current[lastKey];
        delete current[lastKey];
        current[newKey] = value;
      }

      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);

      return updated;
    });
  };

  const handleAddNestedField = (index: number, path: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      const nestedPath = `${path}.newField`;
      updateNestedObject(updated[index], nestedPath, "");
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const handleInputChange = (index: number, path: string, newValue: any) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedObject(updated[index], path, newValue);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const handleAddResource = (resourceType: string) => {
    if (!(resourceType in k8sDefinitions)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    const resource =
      k8sDefinitions[resourceType as keyof typeof k8sDefinitions];

    if (!("properties" in resource)) {
      console.error(`No properties found for resource type: ${resourceType}`);
      return;
    }

    const properties = resource.properties as {
      [key: string]: { type?: string; items?: any; $ref?: string };
    };

    const newResource = Object.keys(properties).reduce((acc, key) => {
      const property = properties[key];
      if (key === "kind") {
        acc[key] = getLastWord(resourceType);
      } else if (property.$ref) {
        const refValue = property.$ref.replace("#/definitions/", "");
        acc[key] = resolveRef(refValue);
      } else {
        const propertyType = property.type;
        acc[key] = getDefaultForType(propertyType || "");
      }
      return acc;
    }, {} as { [key: string]: any });

    setJsonObjects((prev) => [...prev, newResource]);

    try {
      const updatedYaml = [
        ...jsonObjects.map((obj) => yamlStringify(obj)),
        yamlStringify(newResource),
      ].join("---\n");
      setYamlValue(updatedYaml);
    } catch (error) {
      console.error("Error updating YAML value:", error);
    }
  };

  const handleEditorChange = (newValue: string) => {
    setYamlValue(newValue);
    try {
      const parsedDocuments = parseAllDocuments(newValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error parsing YAML:", error);
    }
  };

  const toggleKindVisibility = (index: number) => {
    setExpandedResourceIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const renderInputs = (obj: any, index: number, path = ""): JSX.Element[] => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      const inputKey = `${index}-${currentPath}`;
      const isNumber = isNumberKey(currentPath);

      return (
        <div key={inputKey} className="mb-2 flex-1">
          <div>
            <label
              htmlFor={`${inputKey}-key`}
              className="block text-sm font-medium text-white mt-2"
            >
              Key:
            </label>
            <div>
              <input
                id={`${inputKey}-key`}
                type="text"
                value={key}
                onChange={(e) =>
                  handleKeyChange(index, currentPath, e.target.value)
                }
                className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor={`${inputKey}-value`}
              className="block text-sm font-medium text-white mt-2"
            >
              Value:
            </label>
            {typeof value === "object" && value !== null ? (
              <div className="ml-4">
                {renderInputs(value, index, currentPath)}
                <button
                  className="btn bg-blue-400 mt-2"
                  onClick={() => handleAddNestedField(index, currentPath)}
                >
                  <IoIosAdd />
                </button>
              </div>
            ) : isNumber ? (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="number"
                  value={value === null ? "" : value} // Ensure value is not null
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      currentPath,
                      Number(e.target.value)
                    )
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            ) : (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value === null ? "" : value} // Ensure value is not null
                  onChange={(e) =>
                    handleInputChange(index, currentPath, e.target.value)
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const handleDeleteResource = (index: number) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const handleYamlToJson = () => {
    try {
      const parsedDocuments = parseAllDocuments(yamlValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      const json = jsonStringify(parsedObjects, null, 2);
      setYamlValue(json);
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };

  const handleJsonToYaml = () => {
    try {
      const obj = jsonParse(yamlValue);
      const yamlString = obj
        .map((item: any) => yamlStringify(item))
        .join("---\n");
      setYamlValue(yamlString);
      setJsonObjects(obj);
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setYamlValue(text);
        try {
          const parsedDocuments = parseAllDocuments(text);
          const parsedObjects = parsedDocuments.map((doc) => {
            const obj = doc.toJSON();
            obj.kind = obj.kind || "Unknown";
            return obj;
          });
          setJsonObjects(parsedObjects);
        } catch (error) {
          console.error("Error parsing YAML:", error);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  const toggleConvert = () => {
    setIsYamlToJson(!isYamlToJson);
  };

  return (
    <YamlContext.Provider
      value={{
        yamlValue,
        setYamlValue,
        jsonObjects,
        setJsonObjects,
        expandedResourceIndex,
        setExpandedResourceIndex,
        isYamlToJson,
        setIsYamlToJson,
        fileInputRef,
        searchTerm,
        setSearchTerm,
        showSuggestions,
        setShowSuggestions,
        handleSuggestionClick,
        handleEditorChange,
        toggleKindVisibility,
        renderInputs,
        handleDeleteResource,
        handleYamlToJson,
        handleJsonToYaml,
        handleFileChange,
        toggleConvert,
      }}
    >
      {children}
    </YamlContext.Provider>
  );
};

export const useYamlContext = (): YamlContextProps => {
  const context = useContext(YamlContext);
  if (context === undefined) {
    throw new Error("useYamlContext must be used within a YamlProvider");
  }
  return context;
};
