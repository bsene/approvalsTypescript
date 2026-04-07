import { describe, expect, it } from "vitest";
import { verify, verifyAsJson } from "../src/index.js";

describe("verify", () => {
  it("matches a simple greeting", async () => {
    await verify("Hello, world!");
  });

  it("verifies json output", async () => {
    await verifyAsJson({ name: "ada", skills: ["math", "code"] });
  });

  it("throws ApprovalMissingError when no approved file exists", async () => {
    await expect(
      verify("orphan content that has no approved file"),
    ).rejects.toThrow(/No approved file found/);
  });
});
