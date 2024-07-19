import React, { ChangeEvent, RefObject } from "react";
import { FaFileUpload } from "react-icons/fa";

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileInputRef,
  handleFileChange,
}) => {
  return (
    <div className="relative w-[130px] h-[50px]">
      <input
        type="file"
        ref={fileInputRef}
        accept=".yaml,.yml"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      <div
        className="flex items-center justify-center absolute top-0 left-0 h-full text-[15px] text-gray-100 hover:text-hoverColor cursor-pointer  transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-center gap-3">
          <FaFileUpload className="h-5 w-5" /> <span>Upload YAML</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
