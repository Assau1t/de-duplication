Page({
  data: {},

  setting() {
    wx.navigateTo({
      url: "/pages/setting/setting",
    });
  },

  donate() {
    wx.showToast({
      icon: "none",
      title: "暂未开放",
    });
  },
});
