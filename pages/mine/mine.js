Page({
  data: {
    hasCredentials: false,
  },

  onShow() {
    const appid = wx.getStorageSync("appid");
    const key = wx.getStorageSync("key");
    this.setData({
      hasCredentials: Boolean(appid && key),
    });
  },

  setting() {
    wx.navigateTo({
      url: "/pages/setting/setting",
    });
  },

  help() {
    wx.navigateTo({
      url: "/pages/help/help",
    });
  },
});
