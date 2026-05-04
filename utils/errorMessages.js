const fallbackMessage = {
  title: "处理失败",
  message: "服务暂时不可用，请稍后重试。",
  action: "retry",
};

const errorMessages = {
  52001: {
    title: "请求超时",
    message: "百度翻译接口请求超时，请稍后重试。",
    action: "retry",
  },
  52002: {
    title: "服务异常",
    message: "百度翻译系统暂时异常，请稍后重试。",
    action: "retry",
  },
  52003: {
    title: "凭据无效",
    message: "当前 App ID 或密钥不正确，请检查后重新保存。",
    action: "settings",
  },
  54003: {
    title: "调用频率过高",
    message: "百度翻译接口提示调用频率过高，请完成认证或稍后再试。",
    action: "retry",
  },
  54005: {
    title: "长文本频率受限",
    message: "长文本请求过于频繁，请等待 3 秒后再试。",
    action: "retry",
  },
  network: {
    title: "网络异常",
    message: "网络请求失败，请检查网络后重试。",
    action: "retry",
  },
  missingCredentials: {
    title: "需要配置接口",
    message: "请先在设置页填写百度翻译 App ID 和密钥。",
    action: "settings",
  },
};

function getErrorMessage(errorCode) {
  return errorMessages[errorCode] || fallbackMessage;
}

module.exports = {
  getErrorMessage,
  errorMessages,
};
