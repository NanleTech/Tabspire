const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

const env = dotenv.config().parsed || {};

module.exports = {
  mode: "production",
  entry: "./script.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.UNSPLASH_API_KEY": JSON.stringify(env.UNSPLASH_API_KEY),
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "index.html", to: "index.html" },
        { from: "styles.css", to: "styles.css" },
        { from: "scriptures.js", to: "scriptures.js" },
        { from: "script.js", to: "script.js" },
      ],
    }),
  ],
};
