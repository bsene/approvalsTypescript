// test/reporterFactory.test.ts
import { describe, it, expect } from "vitest";
import { DefaultReporterFactory } from "../src/reporters/defaultReporterFactory.js";
import { CommandLineReporter } from "../src/reporters/commandLineReporter.js";

describe("DefaultReporterFactory", () => {
  const factory = new DefaultReporterFactory();

  it("creates CommandLineReporter by default", () => {
    const reporter = factory.create({ type: "cli" });
    expect(reporter).toBeInstanceOf(CommandLineReporter);
  });

  it("loads custom reporter from path", () => {
    // Create a temporary module exporting a default reporter
    const fs = require("fs");
    const path = require("path");
    const tmpDir = require("os").tmpdir();
    const mockPath = path.join(tmpDir, "mockReporter.js");
    fs.writeFileSync(
      mockPath,
      "module.exports.default = class MockReporter { report() {} };",
      "utf8"
    );

    const reporter = factory.create({ type: "custom", customReporterPath: mockPath });
    expect(reporter).toBeDefined();
  });
});
