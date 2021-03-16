const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/server.ts",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "smartChoice.js"
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js"]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};
