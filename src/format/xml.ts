/**
 * Minimal dependency-free XML pretty-printer. Reformats well-formed XML with
 * 2-space indentation. Preserves text inside leaf elements; CDATA, comments,
 * and processing instructions are kept on their own lines.
 */
export function prettyXml(input: string): string {
  const tokens = tokenize(input.trim());
  const out: string[] = [];
  let depth = 0;
  const pad = () => "  ".repeat(depth);

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    if (tok.kind === "text") {
      // Pure whitespace between tags is dropped; non-empty text is emitted
      // inline with surrounding open/close tags by the leaf-element shortcut
      // below, so a free-standing text token here just becomes its own line.
      const trimmed = tok.value.trim();
      if (trimmed) out.push(pad() + escapeText(trimmed));
      continue;
    }
    if (tok.kind === "open") {
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      // Leaf shortcut: <tag>text</tag> on one line.
      if (
        next?.kind === "text" &&
        after?.kind === "close" &&
        after.name === tok.name
      ) {
        out.push(`${pad()}<${tok.raw}>${escapeText(next.value.trim())}</${after.name}>`);
        i += 2;
        continue;
      }
      out.push(`${pad()}<${tok.raw}>`);
      depth++;
      continue;
    }
    if (tok.kind === "close") {
      depth = Math.max(0, depth - 1);
      out.push(`${pad()}</${tok.name}>`);
      continue;
    }
    if (tok.kind === "selfclose") {
      out.push(`${pad()}<${tok.raw}/>`);
      continue;
    }
    // decl, comment, cdata, pi: keep verbatim on their own line.
    out.push(pad() + tok.value);
  }

  return out.join("\n");
}

type Token =
  | { kind: "open"; raw: string; name: string }
  | { kind: "close"; name: string }
  | { kind: "selfclose"; raw: string; name: string }
  | { kind: "text"; value: string }
  | { kind: "decl" | "comment" | "cdata" | "pi"; value: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === "<") {
      // Comment
      if (src.startsWith("<!--", i)) {
        const end = src.indexOf("-->", i + 4);
        const stop = end === -1 ? src.length : end + 3;
        tokens.push({ kind: "comment", value: src.slice(i, stop) });
        i = stop;
        continue;
      }
      // CDATA
      if (src.startsWith("<![CDATA[", i)) {
        const end = src.indexOf("]]>", i + 9);
        const stop = end === -1 ? src.length : end + 3;
        tokens.push({ kind: "cdata", value: src.slice(i, stop) });
        i = stop;
        continue;
      }
      // Declaration / DOCTYPE
      if (src.startsWith("<!", i)) {
        const end = src.indexOf(">", i + 2);
        const stop = end === -1 ? src.length : end + 1;
        tokens.push({ kind: "decl", value: src.slice(i, stop) });
        i = stop;
        continue;
      }
      // Processing instruction
      if (src.startsWith("<?", i)) {
        const end = src.indexOf("?>", i + 2);
        const stop = end === -1 ? src.length : end + 2;
        tokens.push({ kind: "pi", value: src.slice(i, stop) });
        i = stop;
        continue;
      }
      // Tag
      const end = src.indexOf(">", i + 1);
      if (end === -1) {
        tokens.push({ kind: "text", value: src.slice(i) });
        break;
      }
      const inner = src.slice(i + 1, end);
      if (inner.startsWith("/")) {
        tokens.push({ kind: "close", name: inner.slice(1).trim() });
      } else if (inner.endsWith("/")) {
        const raw = inner.slice(0, -1).trimEnd();
        tokens.push({ kind: "selfclose", raw, name: tagName(raw) });
      } else {
        tokens.push({ kind: "open", raw: inner, name: tagName(inner) });
      }
      i = end + 1;
      continue;
    }
    // Text
    const next = src.indexOf("<", i);
    const stop = next === -1 ? src.length : next;
    tokens.push({ kind: "text", value: src.slice(i, stop) });
    i = stop;
  }
  return tokens;
}

function tagName(raw: string): string {
  const m = raw.match(/^[^\s/>]+/);
  return m ? m[0] : raw;
}

function escapeText(s: string): string {
  // Caller passes already-escaped XML text — just collapse internal whitespace.
  return s.replace(/\s+/g, " ");
}
