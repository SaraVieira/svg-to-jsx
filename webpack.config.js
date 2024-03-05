const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    code: "./src/code.ts",
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /(src).*\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /api/],
      },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      // {
      //   test: /\.css$/,
      //   use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      // },

      // // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      // {
      //   test: /\.(png|jpg|gif|webp|svg|zip)$/,
      //   loader: [{ loader: "url-loader" }],
      // },
    ],
  },

  resolve: { extensions: [".ts", ".js"] },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./src/ui.html" }],
    }),
  ],
});
