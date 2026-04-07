import { describe, it } from "vitest";
import {
  verifyBinary,
  verifyException,
  verifyFile,
  verifyXml,
} from "../src/index.js";

describe("core verify", () => {
  it("verifies xml", async () => {
    await verifyXml("<root><item>1</item></root>");
  });

  it("verifies an existing file", async () => {
    await verifyFile(
      new URL("./fixtures/sample.txt", import.meta.url).pathname,
    );
  });

  it("verifies a thrown exception", async () => {
    await verifyException(() => {
      throw new TypeError("boom");
    });
  });

  it("verifies a binary buffer", async () => {
    await verifyBinary(Buffer.from([0x00, 0x01, 0x02, 0xff]));
  });
});
