export interface ApprovalNames {
  approvedPath: string;
  receivedPath: string;
}

/** A Namer derives the approved/received file paths for a given extension. */
export interface Namer {
  names(extension: string): ApprovalNames;
}
