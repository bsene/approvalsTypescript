import { describe, it } from "vitest";
import { combine, scrubDates, scrubGuids, verify } from "../src/index.js";

describe("scrubbers", () => {
  it("scrubs guids and dates", async () => {
    const input =
      "user 550e8400-e29b-41d4-a716-446655440000 created at 2024-01-02T03:04:05.678Z";
    await verify(input, { scrubber: combine(scrubGuids, scrubDates) });
  });
});
