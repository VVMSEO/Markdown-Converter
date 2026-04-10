import React from 'react';
import { Copy, Download, FileText, Code } from 'lucide-react';
import { markdownToHtml, markdownToText } from '../lib/converter';

interface ToolbarProps {
  markdown: string;
  previewMode: 'html' | 'text';
  setPreviewMode: (mode: 'html' | 'text') => void;
  isSaving: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ markdown, previewMode, setPreviewMode, isSaving }) => {
  const handleCopyHtml = async () => {
    const html = markdownToHtml(markdown);
    await navigator.clipboard.writeText(html);
  };

  const handleCopyText = async () => {
    const text = markdownToText(markdown);
    await navigator.clipboard.writeText(text);
  };

  const handleDownloadHtml = () => {
    const html = markdownToHtml(markdown);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const text = markdownToText(markdown);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">Markdown Converter</h1>
        <span className="text-sm text-gray-500">
          {isSaving ? 'Saving...' : 'Saved'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
          <button
            onClick={() => setPreviewMode('html')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'html' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4 inline-block mr-1" />
            Rendered HTML
          </button>
          <button
            onClick={() => setPreviewMode('text')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mr-1" />
            Plain Text
          </button>
        </div>

        <button onClick={handleCopyHtml} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" title="Copy HTML">
          <Copy className="w-4 h-4 mr-2" />
          HTML
        </button>
        <button onClick={handleCopyText} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" title="Copy Plain Text">
          <Copy className="w-4 h-4 mr-2" />
          Text
        </button>
        <button onClick={handleDownloadHtml} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" title="Download .html">
          <Download className="w-4 h-4 mr-2" />
          .html
        </button>
        <button onClick={handleDownloadText} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" title="Download .txt">
          <Download className="w-4 h-4 mr-2" />
          .txt
        </button>
      </div>
    </div>
  );
};
