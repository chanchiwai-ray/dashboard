const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const entries = {
  index: "./src/index.jsx",
  // login: "./src/login.jsx",
};

const htmls = Object.keys(entries).map((name) => {
  return new HtmlWebpackPlugin({
    favicon: `./src/assets/${name}.ico`,
    filename: `${name}.html`,
    template: `./src/templates/${name}.html`,
    chunks: [name],
  });
});

// Main
module.exports = {
  mode: process.env.NODE_ENV,
  entry: entries,
  plugins: htmls,
  output: {
    filename: "[name].js",
    path: Path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    contentBase: Path.resolve(__dirname, "dist"),
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
