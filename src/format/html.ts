import { prettyXml } from "./xml.js";

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Pretty-prints HTML by normalizing void elements to self-closing form and
 * delegating to the XML formatter. This is intentionally lightweight: it
 * handles common, well-formed HTML fragments without pulling in a parser.
 */
export function prettyHtml(input: string): string {
  const normalized = input.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g,
    (match, tag: string, attrs: string) => {
      const lower = tag.toLowerCase();
      if (VOID_ELEMENTS.has(lower) && !attrs.trimEnd().endsWith("/")) {
        return `<${tag}${attrs}/>`;
      }
      return match;
    },
  );
  return prettyXml(normalized);
}
