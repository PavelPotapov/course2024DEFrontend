import path from "path"
import { fileURLToPath } from "url"
import HtmlWebpackPlugin from "html-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.resolve(__dirname, "./src")
const buildDir = path.resolve(__dirname, "./build")
const publicDir = path.resolve(__dirname, "./public")
const pagesDir = path.resolve(__dirname, "./src/pages")

export default async (env, { mode }) => {
	const isDev = mode === "development"
	return {
		mode,
		entry: path.join(baseDir, "app.js"),
		output: {
			path: buildDir,
			filename: "[name].js",
			clean: true,
		},
		devServer: {
			static: {
				directory: publicDir,
			},
			port: 8888,
			open: true,
			historyApiFallback: true,
			hot: true,
			watchFiles: [
				"src/**/*.js",
				"src/**/*.css",
				"src/**/*.html",
				"src/**/*.json",
			],
		},
		module: {
			rules: [
				{
					test: /\.pcss$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
								sourceMap: isDev ? true : false,
							},
						},
						"postcss-loader",
					],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: "index.html",
				template: path.join(pagesDir, "index.js"),
			}),
		],
		devtool: isDev ? "eval-source-map" : false,
	}
}
