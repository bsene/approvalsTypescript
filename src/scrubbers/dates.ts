import { scrubAll } from "./regex";

// ISO 8601 date or datetime, e.g. 2024-01-02 or 2024-01-02T03:04:05.678Z
const ISO_DATE = /\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?/g;

export const scrubDates = scrubAll(ISO_DATE, "<date>");
