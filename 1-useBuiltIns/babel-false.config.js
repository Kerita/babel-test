module.exports = (api) => {
  // 1.output babel version which reads the config file
  console.log("api.version", api.version);

  api.assertVersion("^7.1");

  console.log("api.assertVersion", api.version);

  // 2.
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "IE >= 8",
          useBuiltIns: false,
        },
      ],
    ],
  };
};
