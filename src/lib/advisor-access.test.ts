import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isFalconAdvisorEmail } from "./advisor-access.ts";

describe("isFalconAdvisorEmail", () => {
  it("admits the Workspace domain only", () => {
    assert.equal(isFalconAdvisorEmail("advisor@falconwp.com"), true);
    assert.equal(isFalconAdvisorEmail("  Advisor@FalconWP.com  "), true);
    assert.equal(isFalconAdvisorEmail("a.b+desk@falconwp.com"), true);
  });

  it("rejects gmail, subdomains, and malformed values", () => {
    assert.equal(isFalconAdvisorEmail("advisor@gmail.com"), false);
    assert.equal(isFalconAdvisorEmail("advisor@mail.falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("advisor@falconwp.com.evil.com"), false);
    assert.equal(isFalconAdvisorEmail("falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("a@b@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("advisor @falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("ad..visor@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail(""), false);
    assert.equal(isFalconAdvisorEmail(null), false);
  });

  it("rejects control characters and non-ASCII locals", () => {
    assert.equal(isFalconAdvisorEmail("ad\0visor@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("advisor\n@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("advísor@falconwp.com"), false);
    assert.equal(isFalconAdvisorEmail("advisor@falconwp.com\0.evil"), false);
  });
});
