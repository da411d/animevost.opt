const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  optimization: {
    minimize: true,
    // namedModules: true,
    moduleIds: "natural",
  },
  entry: {
    "background": "./src/background/_index.js",
    "content": "./src/content/_index.js",
  },
  output: {
    filename: "./dist/[name].bundle.js",
    path: path.resolve(__dirname, ""),
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: './dist/[name].bundle.js.map',
    }),
  ],
};
