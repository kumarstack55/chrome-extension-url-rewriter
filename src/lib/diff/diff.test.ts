import { diff } from "./diff.js";
import { describe, it } from "node:test";

describe("diff function", () => {
  it("should return DifferenceResult for identical strings", () => {
    const x = "AGCAT";
    const y = "GAC";
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
    const result = diff(x, y);
    result.ses.map((record) => {
      console.log(record);
    }
  });
});
