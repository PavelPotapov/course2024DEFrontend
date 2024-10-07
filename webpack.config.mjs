import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import CopyPlugin from "copy-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.resolve(__dirname, "./src")
const buildDir = path.resolve(__dirname, "./build")
const publicDir = path.resolve(__dirname, "./public")
const pagesDir = path.resolve(__dirname, "./src/pages")

const folders = ["fonts", "assets"]
const copyFolders = (folders) => {
	return folders.map((folder) => {
		const fromPath = path.resolve(__dirname, "public", folder)
		const toPath = path.resolve(__dirname, "build", folder)
		if (!fs.existsSync(fromPath)) {
			console.warn(`Source folder "${fromPath}" does not exist.`)
		}

		return {
			from: fromPath,
			to: toPath,
			noErrorOnMissing: true,
		}
	})
}

export default async (env, { mode }) => {
	const isDev = mode === "development"
	return {
		mode,
		entry: path.join(baseDir, "app.js"),
		output: {
			path: buildDir,
			filename: "js/[name].js",
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
						isDev ? "style-loader" : MiniCssExtractPlugin.loader,
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
			new MiniCssExtractPlugin({
				filename: "styles/[name][hash].css",
			}),
			new CopyPlugin({
				patterns: [...copyFolders(folders)],
			}),
			new webpack.DefinePlugin({
				"process.env.API_URL": JSON.stringify(env.API_URL),
			}),
		],
		optimization: {
			minimize: isDev ? false : true,
			minimizer: [
				new CssMinimizerPlugin(), // Минификация CSS
				new TerserPlugin(), // Минификация JavaScript
			],
		},
		resolve: {
			alias: {
				"#assets": path.resolve(__dirname, "public/assets"),
				"#features": path.resolve(__dirname, "src/features"),
				"#pages": path.resolve(__dirname, "src/pages"),
				"#shared": path.resolve(__dirname, "src/shared"),
			},
			extensions: [".js", ".pcss"],
		},
		devtool: isDev ? "source-map" : false,
	}
}
