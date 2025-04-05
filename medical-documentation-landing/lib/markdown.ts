import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function markdownToHtml(markdown: string): string {
  return DOMPurify.sanitize(marked.parse(markdown))
}