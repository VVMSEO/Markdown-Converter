import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function markdownToHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml);
}

export function markdownToText(markdown: string): string {
  const html = markdownToHtml(markdown);
  // Strip all HTML tags using regex
  return html.replace(/<[^>]*>?/gm, '');
}
