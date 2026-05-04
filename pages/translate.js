const MD5 = require("md5");

function translate(from, to, query) {
  const appid = wx.getStorageSync("appid");
  const key = wx.getStorageSync("key");
  const salt = new Date().getTime();
  const sign = MD5.MD5(appid + query + salt + key);

  return new Promise((resolve) => {
    wx.request({
      url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
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
        const data = res.data || {};
        if (data.trans_result && data.trans_result[0]) {
          resolve({
            ok: true,
            text: data.trans_result[0].dst,
          });
          return;
        }

        resolve({
          ok: false,
          errorCode: data.error_code || "unknown",
        });
      },
      fail() {
        resolve({
          ok: false,
          errorCode: "network",
        });
      },
    });
  });
}

module.exports = translate;
