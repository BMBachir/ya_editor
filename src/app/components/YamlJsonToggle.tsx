// YAML to JSON/JSON to YAML Toggle Component
import { GiCardExchange } from "react-icons/gi";

interface YamlJsonToggleProps {
  isYamlToJson: boolean;
  setIsYamlToJson: React.Dispatch<React.SetStateAction<boolean>>;
  handleYamlToJson: () => void;
  handleJsonToYaml: () => void;
}

const YamlJsonToggle: React.FC<YamlJsonToggleProps> = ({
  isYamlToJson,
  setIsYamlToJson,
  handleYamlToJson,
  handleJsonToYaml,
}) => {
  const toggleConvert = () => {
    setIsYamlToJson(!isYamlToJson);
  };

  return (
    <div className="">
      {isYamlToJson ? (
        <button
          className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
          onClick={() => {
            handleYamlToJson();
            toggleConvert();
          }}
        >
          <GiCardExchange className="h-5 w-5" />
          YAML to JSON
        </button>
      ) : (
        <button
          className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
          onClick={() => {
            handleJsonToYaml();
            toggleConvert();
          }}
        >
          <GiCardExchange className="h-5 w-5" />
          JSON to YAML
        </button>
      )}
    </div>
  );
};

export default YamlJsonToggle;
