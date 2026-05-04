const rewriteModes = [
  {
    id: "classic",
    name: "经典回译",
    badge: "可用",
    available: true,
    description: "通过多语言链路重组句式，适合快速降低重复表达。",
  },
  {
    id: "smart",
    name: "智能改写",
    badge: "预留",
    available: false,
    description: "预留大模型改写入口，当前版本不在小程序端暴露 API 密钥。",
  },
];

const rewriteLevels = [
  {
    id: "light",
    name: "轻度去重",
    summary: "速度更快，保留原意和表达风格",
    languages: ["zh", "en", "de", "zh"],
  },
  {
    id: "medium",
    name: "中度去重",
    summary: "平衡改写幅度和可读性",
    languages: ["zh", "en", "de", "jp", "pt", "zh"],
  },
  {
    id: "heavy",
    name: "重度去重",
    summary: "链路更长，改写幅度更明显",
    languages: ["zh", "en", "de", "jp", "pt", "it", "pl", "bul", "est", "zh"],
  },
];

function getMode(modeId) {
  return rewriteModes.find((mode) => mode.id === modeId) || rewriteModes[0];
}

function getLevel(level) {
  if (typeof level === "number") {
    return rewriteLevels[level] || rewriteLevels[0];
  }
  return rewriteLevels.find((item) => item.id === level) || rewriteLevels[0];
}

function getLanguageSteps(level) {
  return getLevel(level).languages.slice();
}

module.exports = {
  rewriteModes,
  rewriteLevels,
  getMode,
  getLevel,
  getLanguageSteps,
};
