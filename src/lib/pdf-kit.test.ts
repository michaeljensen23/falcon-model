import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fit, wrap } from "./pdf-kit.ts";

describe("pdf wrap", () => {
  it("breaks an unbreakable token that exceeds the line width", () => {
    const lines = wrap("Supercalifragilisticexpialidocious", 18, 40, true);
    assert.ok(lines.length > 1);
    for (const line of lines) {
      assert.ok(line.length < 30, line);
    }
  });

  it("fits cover titles with an ellipsis", () => {
    const fitted = fit("The Very Long Household Trust Name Of The Entire Family", 18, 80, true);
    assert.ok(fitted.endsWith("..."));
    assert.ok(fitted.length < 60);
  });
});
