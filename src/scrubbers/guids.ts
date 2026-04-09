import { scrubAll } from "./regex";

const GUID = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

export const scrubGuids = scrubAll(GUID, "<guid>");
