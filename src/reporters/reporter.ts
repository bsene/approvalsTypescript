export interface Reporter {
  report(receivedPath: string, approvedPath: string): void | Promise<void>;
}
