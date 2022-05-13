module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "IE >= 11",
          debug: true,
          useBuiltIns: "usage",
          corejs: "3.22",
        },
      ],
    ],
  };
};
