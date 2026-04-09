import type { Scrubber } from "../options";

export type Replacement = string | ((match: string, ...groups: string[]) => string);

export function scrubAll(pattern: RegExp, replacement: Replacement): Scrubber {
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  const global = new RegExp(pattern.source, flags);
  return (input) =>
    typeof replacement === "string"
      ? input.replace(global, replacement)
      : input.replace(global, replacement as (...args: string[]) => string);
}

export function combine(...scrubbers: Scrubber[]): Scrubber {
  return (input) => scrubbers.reduce((acc, s) => s(acc), input);
}
