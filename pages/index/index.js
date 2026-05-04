const Dialog = require("@vant/weapp/dialog/dialog").default;
const translate = require("../translate");
const {
  rewriteModes,
  rewriteLevels,
  getMode,
  getLevel,
  getLanguageSteps,
} = require("../../utils/rewriteStrategies");
const { getErrorMessage } = require("../../utils/errorMessages");
const { getTextMetrics, compareTextMetrics } = require("../../utils/textMetrics");

function buildProgressSteps(level) {
  const languages = getLanguageSteps(level);
  const steps = [];
  for (let i = 0; i < languages.length - 1; i += 1) {
    steps.push({
      id: `${languages[i]}-${languages[i + 1]}-${i}`,
      label: `${languages[i]} -> ${languages[i + 1]}`,
      status: "pending",
    });
  }
  return steps;
}

Page({
  data: {
    rewriteModes,
    rewriteLevels,
    selectedMode: "classic",
    selectedModeInfo: getMode("classic"),
    level: 0,
    selectedLevel: getLevel(0),
    content: "",
    textarea: { maxHeight: 220, minHeight: 120 },
    result: "",
    loading: false,
    hasCredentials: false,
    statusText: "准备处理",
    lastStatus: "idle",
    inputMetrics: getTextMetrics(""),
    resultMetrics: compareTextMetrics("", ""),
    progressSteps: buildProgressSteps(0),
  },

  onShow() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    this.refreshCredentialStatus();
  },

  refreshCredentialStatus() {
    const appid = wx.getStorageSync("appid");
    const key = wx.getStorageSync("key");
    this.setData({
      hasCredentials: Boolean(appid && key),
    });
  },

  selectMode(event) {
    const modeId = event.currentTarget.dataset.mode;
    const mode = getMode(modeId);
    this.setData({
      selectedMode: mode.id,
      selectedModeInfo: mode,
      lastStatus: mode.available ? "idle" : "disabled",
      statusText: mode.available ? "准备处理" : "智能改写暂未接入",
    });
  },

  selectLevel(event) {
    const level = Number(event.currentTarget.dataset.index);
    this.setData({
      level,
      selectedLevel: getLevel(level),
      progressSteps: buildProgressSteps(level),
    });
  },

  onChange(event) {
    const content = event.detail;
    this.setData({
      content,
      inputMetrics: getTextMetrics(content),
    });
  },

  async deDuplication() {
    const content = this.data.content.trim();
    if (!content) {
      wx.showToast({
        title: "请输入文本",
        icon: "error",
      });
      return;
    }

    if (!this.data.hasCredentials) {
      this.showError("missingCredentials");
      return;
    }

    if (!getMode(this.data.selectedMode).available) {
      Dialog.alert({
        title: "智能改写预留",
        message: "当前版本先完成前端架构位，不在小程序端接入或暴露大模型 API 密钥。",
      });
      return;
    }

    await this.runClassicRewrite(content);
  },

  async runClassicRewrite(content) {
    let currentText = content;
    const languages = getLanguageSteps(this.data.level);
    const progressSteps = buildProgressSteps(this.data.level);

    this.setData({
      loading: true,
      result: "",
      progressSteps,
      lastStatus: "running",
      statusText: "正在多语言回译",
      resultMetrics: compareTextMetrics(content, ""),
    });

    for (let i = 0; i < languages.length - 1; i += 1) {
      this.updateProgressStep(i, "running");
      const response = await translate(languages[i], languages[i + 1], currentText);

      if (!response.ok) {
        this.updateProgressStep(i, "error");
        this.setData({
          loading: false,
          lastStatus: "error",
          statusText: "处理失败",
        });
        this.showError(response.errorCode);
        return;
      }

      currentText = response.text;
      this.updateProgressStep(i, "done");
    }

    this.setData({
      result: currentText,
      loading: false,
      lastStatus: "done",
      statusText: "处理完成",
      resultMetrics: compareTextMetrics(content, currentText),
    });
    wx.showToast({
      title: "去重完成",
      icon: "success",
    });
  },

  updateProgressStep(index, status) {
    const progressSteps = this.data.progressSteps.map((step, stepIndex) => {
      if (stepIndex !== index) {
        return step;
      }
      return Object.assign({}, step, { status });
    });
    this.setData({ progressSteps });
  },

  showError(errorCode) {
    const error = getErrorMessage(errorCode);
    Dialog.alert({
      title: error.title,
      message: error.message,
      confirmButtonText: error.action === "settings" ? "去设置" : "知道了",
    }).then(() => {
      if (error.action === "settings") {
        wx.navigateTo({
          url: "/pages/setting/setting",
        });
      }
    });
  },

  copy() {
    if (!this.data.result) {
      wx.showToast({
        title: "暂无结果",
        icon: "none",
      });
      return;
    }

    wx.setClipboardData({
      data: this.data.result,
      success() {
        wx.showToast({
          title: "已复制",
          duration: 1500,
        });
      },
    });
  },

  clearAll() {
    this.setData({
      content: "",
      result: "",
      inputMetrics: getTextMetrics(""),
      resultMetrics: compareTextMetrics("", ""),
      progressSteps: buildProgressSteps(this.data.level),
      lastStatus: "idle",
      statusText: "准备处理",
    });
  },

  retry() {
    if (!this.data.loading) {
      this.deDuplication();
    }
  },

  goSetting() {
    wx.navigateTo({
      url: "/pages/setting/setting",
    });
  },
});
