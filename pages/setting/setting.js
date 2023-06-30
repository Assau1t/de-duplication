Page({
  data: {
    appid: "",
    key: "",
    disabled: true,
  },

  onShow() {
    if (!this.data.appid && !this.data.key) {
      let appid = wx.getStorageSync("appid");
      let key = wx.getStorageSync("key");
      this.setData({
        appid: appid,
        key: key,
      });
    }
    if (!this.data.appid || !this.data.key) {
      console.log("有一个是空的");
      this.setData({ disabled: false });
    }
  },

  onChange(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    let detail = event.detail;
    if (index == "appid") {
      this.setData({ appid: detail });
    } else if (index == "key") {
      this.setData({ key: detail });
    }
  },

  help() {
    wx.navigateTo({
      url: "/pages/help/help",
    });
  },

  disabled(event) {
    this.setData({
      disabled: event.detail,
    });
  },

  confirm() {
    let appid = this.data.appid;
    let key = this.data.key;
    if (appid && key) {
      wx.setStorageSync("appid", appid);
      wx.setStorageSync("key", key);
      wx.showToast({
        title: "修改成功",
        icon: "success",
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    } else {
      wx.showToast({
        title: "请填写完整",
        icon: "error",
      });
    }
  },
});
