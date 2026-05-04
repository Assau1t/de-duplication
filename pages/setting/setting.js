const Dialog = require("@vant/weapp/dialog/dialog").default;

function maskKey(key) {
  if (!key) {
    return "";
  }
  if (key.length <= 8) {
    return "********";
  }
  return `${key.slice(0, 4)}********${key.slice(-4)}`;
}

Page({
  data: {
    appid: "",
    key: "",
    editing: false,
    hasCredentials: false,
    maskedKey: "",
  },

  onShow() {
    this.loadCredentials();
  },

  loadCredentials() {
    const appid = wx.getStorageSync("appid") || "";
    const key = wx.getStorageSync("key") || "";
    this.setData({
      appid,
      key,
      maskedKey: maskKey(key),
      hasCredentials: Boolean(appid && key),
      editing: !(appid && key),
    });
  },

  onChange(event) {
    const index = event.currentTarget.dataset.index;
    const value = event.detail;
    if (index === "appid") {
      this.setData({ appid: value });
    }
    if (index === "key") {
      this.setData({
        key: value,
        maskedKey: maskKey(value),
      });
    }
  },

  edit() {
    this.setData({ editing: true });
  },

  help() {
    wx.navigateTo({
      url: "/pages/help/help",
    });
  },

  confirm() {
    const appid = this.data.appid.trim();
    const key = this.data.key.trim();

    if (!appid || !key) {
      wx.showToast({
        title: "请填写完整",
        icon: "error",
      });
      return;
    }

    wx.setStorageSync("appid", appid);
    wx.setStorageSync("key", key);
    this.setData({
      appid,
      key,
      maskedKey: maskKey(key),
      hasCredentials: true,
      editing: false,
    });
    wx.showToast({
      title: "已保存",
      icon: "success",
    });
  },

  clearCredentials() {
    Dialog.confirm({
      title: "清除接口配置",
      message: "清除后需要重新填写 App ID 和密钥才能使用经典回译。",
    }).then(() => {
      wx.removeStorageSync("appid");
      wx.removeStorageSync("key");
      this.setData({
        appid: "",
        key: "",
        maskedKey: "",
        hasCredentials: false,
        editing: true,
      });
      wx.showToast({
        title: "已清除",
        icon: "success",
      });
    }).catch(() => {});
  },
});
