import path from "path";
import { addSideEffect, addDefault } from "@babel/helper-module-imports";

export default class Plugin {
  constructor(libraryName, libraryDirectory = "lib", style = false, types) {
    this.libraryName = libraryName;
    this.libraryDirectory = libraryDirectory;
    this.style = style;
    this.types = types;
  }

  getPluginState(state) {
    if (state) {
      return state;
    }

    return {};
  }

  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);

    pluginState.specified = Object.create(null);
    pluginState.selectedMethods = Object.create(null);
    pluginState.pathsToRemove = [];
  }

  ProgramExit(path, state) {
    // 删除旧的 import
    this.getPluginState(state).pathsToRemove.forEach(
      (p) => !p.removed && p.remove()
    );
  }

  ImportDeclaration(path, state) {
    const { node } = path;
    const pluginState = this.getPluginState(state);

    if (node) {
      const { value } = node.source;
      const { libraryName, types } = this;

      if (value === libraryName) {
        // node.specifiers 表示所有的 import
        node.specifiers.forEach((spec) => {
          if (types.isImportSpecifier(spec)) {
            pluginState.specified[spec.local.name] = spec.imported.name;
          }
          // else {
          //   ImportDefaultSpecifier 和 ImportNamespaceSpecifier
          //   pluginState.libraryObjs[spec.local.name] = true;
          // }
        });
        pluginState.pathsToRemove.push(path);
      }
    }
  }

  CallExpression(path, state) {
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);

    const { name } = node.callee;
    const { types } = this;
    const pluginState = this.getPluginState(state);

    // 如果方法调用者是 Identifier 类型
    // if (types.isIdentifier(node.callee)) {
    //   if (pluginState.specified[name]) {
    //     node.callee = this.importMethod(
    //       pluginState.specified[name],
    //       file,
    //       pluginState
    //     );
    //   }
    // }

    // 遍历 arguments 找我们要的 specifier
    node.arguments = node.arguments.map((arg) => {
      const { name: argName } = arg;
      const specifierName = pluginState.specified[argName];
      // 检查是否在作用域内绑定
      // 并且是通过 ImportSpecifier 绑定
      if (
        specifierName &&
        path.scope.hasBinding(argName) &&
        path.scope.getBinding(argName).path.type === "ImportSpecifier"
      ) {
        return this.importMethod(specifierName, file, pluginState);
      }

      return arg;
    });
  }

  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      const { style, libraryName, libraryDirectory } = this;

      const modulePath = path.join(libraryName, libraryDirectory, methodName);

      pluginState.selectedMethods[methodName] = addDefault(
        file.path,
        modulePath,
        {
          nameHint: methodName,
        }
      );

      if (style) {
        // 生成样式 import 语句
        // import 'antd/lib/button/style'
        addSideEffect(file.path, `${modulePath}/style`);
      }
    }

    return {
      ...pluginState.selectedMethods[methodName],
    };
  }
}
