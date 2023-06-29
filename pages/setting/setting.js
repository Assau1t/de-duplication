Page({
  data: {
    appid: "",
    key: "",
    disabled: true,
  },

  onShow() {
    var appid = wx.getStorageSync("appid");
    var key = wx.getStorageSync("key");
    this.setData({
      appid: appid,
      key: key,
    });
    if ((appid || key) == false) {
      console.log("有一个是空的");
      this.setData({ disabled: false });
    }
  },

  onChange(event) {
    console.log(event);
    var index = event.currentTarget.dataset.index;
    var detail = event.detail;
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
    var appid = this.data.appid;
    var key = this.data.key;
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
