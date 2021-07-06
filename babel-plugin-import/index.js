import Plugin from "./Plugin.js";

export default function ({ types }) {
  let plugins = null;

  // 将插件作用到节点
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      if (plugin) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }

  const Program = {
    enter(path, { opts = {} }) {
      if (!plugins) {
        const { libraryName, libraryDirectory, style } = opts;
        plugins = [new Plugin(libraryName, libraryDirectory, style, types)];
      }

      applyInstance("ProgramEnter", arguments, this);
    },

    exit() {
      applyInstance("ProgramExit", arguments, this);
    },
  };

  const ret = {
    visitor: {
      Program,
    },
  };

  const methods = ["ImportDeclaration", "CallExpression"];

  methods.forEach((method) => {
    ret.visitor[method] = function () {
      applyInstance(method, arguments, ret.visitor);
    };
  });

  return ret;
}
