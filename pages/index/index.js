const app = getApp();
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
import translate from "../translate";

Page({
  data: {
    showLevelSelection: false,
    levelPicker: ["轻度去重", "中度去重", "重度去重"],
    level: 0,
    content: "",
    textarea: { maxHeight: 140, minHeight: 50 },
    result: "",
    principle: [
      ["zh", "en", "de", "zh"],
      ["zh", "en", "de", "jp", "pt", "zh"],
      ["zh", "en", "de", "jp", "pt", "it", "pl", "bul", "est", "zh"],
    ],
    loading: false,
  },
  onShow() {
    let appid = wx.getStorageSync("appid");
    let key = wx.getStorageSync("key");
    if (!(appid && key)) {
      Dialog.alert({
        title: "提示",
        message:
          "（第一次使用或缓存被清除）\n您的百度翻译appid或key不完整，请设置以正常使用。",
        confirmButtonText: "去设置",
      }).then(() => {
        wx.navigateTo({
          url: "/pages/setting/setting",
        });
      });
    }
  },

  showLevelSelection() {
    this.setData({ showLevelSelection: true });
  },

  closeLevelSelection() {
    this.setData({ showLevelSelection: false });
  },

  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({ level: event.detail.index });
    this.setData({ showLevelSelection: false });
  },

  onCancel() {
    Toast("取消");
    this.setData({ showLevelSelection: false });
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      content: event.detail,
    });
  },

  deDuplication() {
    // 判断输入框是否为空
    if (this.data.content !== "") {
      (async () => {
        this.setData({ loading: true });
        // 测试是否能正确请求，不能则会返回'error'
        await translate("en", "zh", "a");
        // 判断测试结果错误与否
        let testResult = wx.getStorageSync("tempResult");
        console.log(`testResult:${testResult}`);
        if (testResult !== "error") {
          wx.setStorageSync("tempResult", this.data.content);
          let principle = this.data.principle;
          let level = this.data.level;
          (async () => {
            for (let i = 0; i < principle[level].length; i++) {
              if (i < principle[level].length - 1) {
                await translate(
                  principle[level][i],
                  principle[level][i + 1],
                  wx.getStorageSync("tempResult")
                );
              } else {
                let result = wx.getStorageSync("tempResult");
                this.setData({
                  result: result,
                  loading: false,
                });
                console.log("最后结果是：" + result);
                wx.setStorageSync("tempResult", "");
                wx.showToast({
                  title: "去重完成",
                  icon: "success",
                });
              }
            }
          })();
        } else {
          this.setData({ loading: false });
          let errorCode = wx.getStorageSync("errorCode");
          console.log(errorCode);
          switch (errorCode) {
            case "52001":
              Dialog.alert({
                title: "提示",
                message: "请求超时，请重试。",
              }).then(() => {});
              break;
            case "52002":
              Dialog.alert({
                title: "提示",
                message: "百度翻译系统错误，请重试。",
              }).then(() => {});
              break;
            case "52003":
              Dialog.alert({
                title: "提示",
                message:
                  "您设置的百度翻译appid或key不正确，无法启用翻译接口，请检查。",
                confirmButtonText: "去修改",
              }).then(() => {
                wx.navigateTo({
                  url: "/pages/setting/setting",
                });
              });
              break;
            case "54003":
              Dialog.alert({
                title: "提示",
                message:
                  "百度翻译接口提示您的调用频率过高，需进行身份认证后切换为高级版/尊享版",
              }).then(() => {});
              break;
            case "54005":
              Dialog.alert({
                title: "提示",
                message: "百度翻译接口提示请降低长文本的发送频率，3s后再试",
              }).then(() => {});
              break;
          }
        }
      })();
    } else {
      wx.showToast({
        title: "请输入文本",
        icon: "error",
      });
    }
  },

  copy() {
    wx.setClipboardData({
      data: this.data.result,
      success(res) {
        wx.showToast({
          title: "已复制到剪贴板",
          duration: 1500,
        });
      },
    });
  },
});
