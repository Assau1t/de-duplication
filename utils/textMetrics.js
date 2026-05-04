function normalizeText(text) {
  return String(text || "").trim();
}

function countCharacters(text) {
  return normalizeText(text).replace(/\s/g, "").length;
}

function getTextMetrics(text) {
  const normalized = normalizeText(text);
  const lines = normalized ? normalized.split(/\r?\n/).length : 0;
  const paragraphs = normalized
    ? normalized.split(/\r?\n\s*\r?\n/).filter(Boolean).length
    : 0;

  return {
    characters: countCharacters(normalized),
    paragraphs,
    lines,
  };
}

function formatDelta(delta) {
  if (delta > 0) {
    return `+${delta}`;
  }
  return String(delta);
}

function compareTextMetrics(original, result) {
  const originalCharacters = countCharacters(original);
  const resultCharacters = countCharacters(result);
  const delta = resultCharacters - originalCharacters;

  return {
    originalCharacters,
    resultCharacters,
    delta,
    deltaLabel: formatDelta(delta),
  };
}

module.exports = {
  getTextMetrics,
  compareTextMetrics,
};
