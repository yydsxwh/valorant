const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const source = readFileSync(join(__dirname, "../docs/theme.js"), "utf8");

async function run({ responses = {}, cached = null, blockedStorage = false } = {}) {
  const values = {};
  const requests = [];
  const writes = [];
  const root = { style: { setProperty: (key, value) => { values[key] = value; } }, dataset: {}, setAttribute() {} };
  vm.runInNewContext(source, {
    document: { documentElement: root, getElementById: () => null },
    localStorage: {
      getItem: () => { if (blockedStorage) throw new Error("storage disabled"); return cached; },
      setItem: (key, value) => { if (blockedStorage) throw new Error("storage disabled"); writes.push([key, JSON.parse(value)]); },
    },
    fetch: async (url) => {
      requests.push(url);
      const value = responses[url];
      return { ok: value !== undefined, json: async () => value, text: async () => typeof value === "string" ? value : "" };
    },
  });
  await new Promise(setImmediate);
  return { values, requests, writes };
}

test("maps the current public colors payload and caches it", async () => {
  const result = await run({ responses: { "/api/theme/public": { colors: { brand: "#123456", bg: "#abcdef" }, paletteId: "test-public" } } });
  assert.equal(result.values["--brand"], "#123456");
  assert.equal(result.values["--bg"], "#abcdef");
  assert.equal(result.writes[0][1].vars["--brand"], "#123456");
  assert.deepEqual(result.requests, ["/api/theme/public"]);
});

test("blocked local storage does not discard a valid public theme", async () => {
  const result = await run({ blockedStorage: true, responses: {
    "/api/theme/public": { colors: { brand: "#123456" } },
    "/api/public/theme": { vars: { "--brand": "#ffffff" } },
  } });
  assert.equal(result.values["--brand"], "#123456");
  assert.deepEqual(result.requests, ["/api/theme/public"]);
});

test("accepts a legacy vars snapshot when the public endpoint is unavailable", async () => {
  const result = await run({ responses: { "/api/public/theme": { vars: { "--brand": "#fedcba" } } } });
  assert.equal(result.values["--brand"], "#fedcba");
});

test("uses a fresh cached snapshot without another request", async () => {
  const result = await run({ cached: JSON.stringify({ vars: { "--brand": "#887766" }, storedAt: Date.now() }) });
  assert.equal(result.values["--brand"], "#887766");
  assert.deepEqual(result.requests, []);
});
