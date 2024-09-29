import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"

// Получаем текущий файл и директорию
// console.debug(__dirname) //так не получится __dirname is not defined in ES module scope
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.resolve(__dirname, "./src")
const buildDir = path.resolve(__dirname, "./build")
const publicDir = path.resolve(__dirname, "./public")

const generatePages = ({ extension: ext = ".ejs", isDev = false } = {}) => {
	const pagesDir = path.resolve(__dirname, "./src/pages")
	const files = fs.readdirSync(pagesDir)
	const isEjs = ext === ".ejs" ? true : false

	return files
		.filter((file) => file.endsWith(ext))
		.map((file) => {
			const templatePath = `${isEjs ? "!!ejs-compiled-loader!" : ""}${path.join(
				pagesDir,
				file
			)}`
			const filename = path.join("pages", file)

			return new HtmlWebpackPlugin({
				template: templatePath,
				filename: `${filename.split(".")[0]}.html`,
				minify: {
					collapseWhitespace: isDev ? true : false,
				},
			})
		})
}

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

export default (env, { mode }) => {
	const isDev = mode === "development" ? true : false
	return {
		mode: isDev ? "development" : "production",
		entry: path.join(baseDir, "app.js"),
		output: {
			path: buildDir,
			filename: "[name].[contenthash].bundle.js",
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
				"src/**/*.ejs",
			],
		},
		module: {
			rules: [
				{
					test: /\.ejs$/,
					use: ["ejs-compiled-loader"],
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					type: "asset/resource",
					generator: {
						filename: "assets/images/[hash][ext][query]",
					},
				},
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
				template: `!!ejs-compiled-loader!${path.join(baseDir, "index.ejs")}`,
				filename: "index.html",
				minify: {
					collapseWhitespace: isDev ? true : false,
				},
			}),
			...generatePages({ isDev }),
			new MiniCssExtractPlugin({
				filename: "styles/[name][hash].css",
			}),
			new CopyPlugin({
				patterns: [...copyFolders(folders)],
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
				"@assets": path.resolve(__dirname, "public/assets"),
				"@components": path.resolve(__dirname, "src/components"),
			},
			extensions: [".js", ".ejs", ".css", ".pcss"],
		},
	}
}
