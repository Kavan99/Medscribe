import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"

export async function markdownToHtml(markdown: string): Promise<string> {
  const parsed = await marked.parse(markdown)
  return DOMPurify.sanitize(parsed)
}
