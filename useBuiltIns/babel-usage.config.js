module.exports = (api) => {
  // 缓存配置
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            chrome: 43,
          },
          useBuiltIns: "usage",
          // corejs: {
          //   version: "3.15",
          //   proposals: true,
          // },
          corejs: "3.15",
          shippedProposals: true,
        },
      ],
    ],
  };
};
