import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex-1 h-full flex flex-col border-r border-gray-200">
      <div className="p-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Markdown Input
      </div>
      <textarea
        className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-0 font-mono text-sm text-gray-800 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your markdown here..."
      />
    </div>
  );
};
