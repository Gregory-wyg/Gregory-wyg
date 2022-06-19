const path = require("path");
module.exports = {
  publicPath: "/",
  configureWebpack: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./node_modules/"),
        "@": path.resolve(__dirname, "./src"),
        api: path.resolve("./src/api"),
        common: path.resolve("./src/common"),
        components: path.resolve("./src/components"),
        config: path.resolve("./src/config"),
        locale: path.resolve("./src/locale"),
        router: path.resolve("./src/router"),
        store: path.resolve("./src/store"),
        assets: path.resolve("./src/assets"),
        views: path.resolve("./src/views"),
      },
    },
  },
  lintOnSave: false
};