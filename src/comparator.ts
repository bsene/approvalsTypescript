/**
 * Compares received content against the approved value. Returns true when
 * they should be considered equivalent. Default behavior is exact string
 * equality (after line-ending normalization done by the caller).
 */
export interface Comparator {
  equals(received: string, approved: string): boolean;
}

export const stringComparator: Comparator = {
  equals: (a, b) => a === b,
};
