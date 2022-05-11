module.exports = (babel, opts) => {
  const { convertIdentifiderMap } = opts;

  return {
    visitor: {
      // Identifier(path, state) {
      //   const { node } = path;
      //   const value = convertIdentifiderMap[node.name];
      //   if (value) {
      //     node.name = value;
      //   }
      // },

      ArrowFunctionExpression(path) {
        const node = path.node;
        if (node.type === "ArrowFunctionExpression") {
          node.type = "FunctionExpression";
        }
      },

      ArrowFunctionExpression(path) {
        path.arrowFunctionToExpression({});
      },
    },
  };
};
