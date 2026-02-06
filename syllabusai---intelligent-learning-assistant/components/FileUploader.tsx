
import React from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:bg-slate-50"
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-4 bg-indigo-50 rounded-full mb-4">
            <Upload className={`w-10 h-10 ${isLoading ? 'animate-bounce text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <p className="mb-2 text-lg font-semibold text-slate-700">
            {isLoading ? "Analyzing your syllabus..." : "Upload your syllabus"}
          </p>
          <p className="text-sm text-slate-500 text-center px-8">
            PDF, Images, or text files supported. Let AI parse your learning journey.
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleChange} 
          accept="image/*,.pdf,.txt"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 rounded-3xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm font-medium text-indigo-600">Extracting topics...</span>
            </div>
          </div>
        )}
      </label>
    </div>
  );
};
