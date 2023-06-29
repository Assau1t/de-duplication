const MD5 = require("md5");

const translate = (from, to, query) => {
  var appid = wx.getStorageSync("appid");
  var key = wx.getStorageSync("key");
  var salt = new Date().getTime();
  var query = query;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = from;
  var to = to;
  var str1 = appid + query + salt + key;
  var sign = MD5.MD5(str1);
  return new Promise((resolve, reject) => {
    wx.request({
      url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
      method: "GET",
      data: {
        q: query,
        from,
        to,
        appid,
        salt,
        sign,
      },
      success(res) {
        if (res.data.trans_result) {
          var dst = res.data.trans_result[0].dst;
          wx.setStorageSync("tempResult", dst);
          console.log(from + "→" + to + "：" + dst);
          resolve();
        } else {
          // wx.setStorageSync('tempResult', res.data.error_code);
          wx.setStorageSync("tempResult", "error");
          wx.setStorageSync("errorCode", res.data.error_code);
          resolve();
        }
      },
      fail(res) {
        console.log(res);
      },
    });
  });
};

export default translate;
