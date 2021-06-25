module.exports = (api) => {
  // 缓存配置
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "IE >= 8",
          useBuiltIns: "entry",
          corejs: "3.15",
        },
      ],
    ],
  };
};
