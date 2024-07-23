import React from "react";

interface SimpleFieldsProps {
  schema: { [key: string]: any };
  values: { [key: string]: any };
  handleInputChange: (path: string, newValue: any) => void;
}

const SimpleFields: React.FC<SimpleFieldsProps> = ({
  schema,
  values,
  handleInputChange,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        {Object.keys(schema).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-white mt-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type={schema[key] === "number" ? "number" : "text"}
              value={values[key] || ""}
              onChange={(e) =>
                handleInputChange(
                  key,
                  schema[key] === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              className="input mt-1 block w-full rounded-md"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SimpleFields;
