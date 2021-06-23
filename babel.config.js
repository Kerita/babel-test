module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    plugins: ["@babel/plugin-transform-arrow-functions"],
  };
};
