module.exports = (api) => {
  // 缓存配置
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "IE >= 8",
          useBuiltIns: "usage",
          corejs: "3.15",
        },
      ],
    ],
  };
};
