import type { Scrubber } from "../options.js";

export function scrubAll(pattern: RegExp, replacement: string): Scrubber {
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  const global = new RegExp(pattern.source, flags);
  return (input) => input.replace(global, replacement);
}

export function combine(...scrubbers: Scrubber[]): Scrubber {
  return (input) => scrubbers.reduce((acc, s) => s(acc), input);
}
