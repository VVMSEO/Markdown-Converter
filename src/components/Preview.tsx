import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownToText } from '../lib/converter';

interface PreviewProps {
  markdown: string;
  mode: 'html' | 'text';
}

export const Preview: React.FC<PreviewProps> = ({ markdown, mode }) => {
  return (
    <div className="flex-1 h-full flex flex-col bg-white">
      <div className="p-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {mode === 'html' ? 'Rendered HTML Preview' : 'Plain Text Preview'}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {mode === 'html' ? (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-gray-800">
            {markdownToText(markdown)}
          </pre>
        )}
      </div>
    </div>
  );
};
