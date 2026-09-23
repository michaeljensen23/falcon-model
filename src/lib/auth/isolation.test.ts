import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CrossSiteRequestError, assertSameSiteHeaders } from "./isolation.server.ts";

function headers(init: Record<string, string>): Headers {
  return new Headers(init);
}

describe("assertSameSiteHeaders", () => {
  it("allows same-origin and user-initiated requests", () => {
    assert.doesNotThrow(() =>
      assertSameSiteHeaders(headers({ "sec-fetch-site": "same-origin" }), "POST"),
    );
    assert.doesNotThrow(() =>
      assertSameSiteHeaders(headers({ "sec-fetch-site": "none" }), "POST"),
    );
  });

  it("allows top-level GET navigations even when cross-site", () => {
    assert.doesNotThrow(() =>
      assertSameSiteHeaders(
        headers({
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
        }),
        "GET",
      ),
    );
  });

  it("blocks scripted sibling and cross-site POSTs", () => {
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({ "sec-fetch-site": "same-site", "sec-fetch-mode": "cors" }),
          "POST",
        ),
      CrossSiteRequestError,
    );
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "cors" }),
          "POST",
        ),
      CrossSiteRequestError,
    );
  });

  it("blocks a sibling form POST (navigate + POST)", () => {
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "navigate",
            "sec-fetch-dest": "document",
          }),
          "POST",
        ),
      CrossSiteRequestError,
    );
  });

  it("fail-closes mutating requests that omit Fetch-Metadata when Origin mismatches Host", () => {
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({
            host: "falcon.grok.me",
            origin: "https://evil.grok.me",
          }),
          "POST",
        ),
      CrossSiteRequestError,
    );
    assert.throws(
      () => assertSameSiteHeaders(headers({ host: "falcon.grok.me" }), "POST"),
      CrossSiteRequestError,
    );
  });

  it("allows a same-origin POST that omitted Fetch-Metadata but sent a matching Origin", () => {
    assert.doesNotThrow(() =>
      assertSameSiteHeaders(
        headers({
          host: "falcon.grok.me",
          origin: "https://falcon.grok.me",
        }),
        "POST",
      ),
    );
  });

  it("does not let X-Forwarded-Host impersonate Origin on a public Host", () => {
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({
            host: "falcon.grok.me",
            "x-forwarded-host": "evil.grok.me",
            origin: "https://evil.grok.me",
          }),
          "POST",
        ),
      CrossSiteRequestError,
    );
  });

  it("honors X-Forwarded-Host only when Host is loopback", () => {
    assert.doesNotThrow(() =>
      assertSameSiteHeaders(
        headers({
          host: "localhost:8080",
          "x-forwarded-host": "falcon.grok.me",
          origin: "https://falcon.grok.me",
        }),
        "POST",
      ),
    );
  });

  it("blocks a sibling GET that omitted Fetch-Metadata but sent a foreign Origin", () => {
    assert.throws(
      () =>
        assertSameSiteHeaders(
          headers({
            host: "falcon.grok.me",
            origin: "https://evil.grok.me",
          }),
          "GET",
        ),
      CrossSiteRequestError,
    );
  });

  it("allows Fetch-Metadata-less GET with no Origin (SSR / same-origin nav)", () => {
    assert.doesNotThrow(() => assertSameSiteHeaders(headers({ host: "falcon.grok.me" }), "GET"));
  });
});
