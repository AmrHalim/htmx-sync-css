import * as path from "path";
import type { Configuration } from "webpack";

const config: Configuration = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts|js$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
