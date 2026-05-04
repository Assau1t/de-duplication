const test = require("node:test");
const assert = require("node:assert/strict");

const {
  rewriteModes,
  rewriteLevels,
  getMode,
  getLevel,
  getLanguageSteps,
} = require("../utils/rewriteStrategies");
const { getErrorMessage } = require("../utils/errorMessages");
const { getTextMetrics, compareTextMetrics } = require("../utils/textMetrics");

test("rewrite strategies expose classic and smart modes", () => {
  assert.equal(rewriteModes.length, 2);
  assert.equal(getMode("classic").available, true);
  assert.equal(getMode("smart").available, false);
  assert.equal(getMode("missing").id, "classic");
});

test("rewrite levels keep the original back-translation chains", () => {
  assert.equal(rewriteLevels.length, 3);
  assert.deepEqual(getLanguageSteps(0), ["zh", "en", "de", "zh"]);
  assert.deepEqual(getLanguageSteps(1), ["zh", "en", "de", "jp", "pt", "zh"]);
  assert.deepEqual(getLanguageSteps(2), [
    "zh",
    "en",
    "de",
    "jp",
    "pt",
    "it",
    "pl",
    "bul",
    "est",
    "zh",
  ]);
  assert.equal(getLevel(99).id, "light");
});

test("error messages map known API and network failures", () => {
  assert.equal(getErrorMessage("52003").action, "settings");
  assert.match(getErrorMessage("network").message, /网络/);
  assert.match(getErrorMessage("unknown-code").message, /稍后重试/);
});

test("text metrics count trimmed characters and compare results", () => {
  assert.deepEqual(getTextMetrics("  论文 去重\n测试  "), {
    characters: 6,
    paragraphs: 1,
    lines: 2,
  });

  assert.deepEqual(compareTextMetrics("论文去重测试", "论文改写测试"), {
    originalCharacters: 6,
    resultCharacters: 6,
    delta: 0,
    deltaLabel: "0",
  });

  assert.equal(compareTextMetrics("论文去重测试", "论文").deltaLabel, "-4");
  assert.equal(compareTextMetrics("论文", "论文去重测试").deltaLabel, "+4");
});
