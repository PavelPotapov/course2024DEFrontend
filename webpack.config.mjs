import path from "path"
import { fileURLToPath, pathToFileURL } from "url"
import fs from "fs"
import HtmlWebpackPlugin from "html-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.resolve(__dirname, "./src")
const buildDir = path.resolve(__dirname, "./build")
const pagesDir = path.resolve(__dirname, "./src/pages")

export const generatePages = async () => {
	const pageFiles = fs.readdirSync(pagesDir)
	const plugins = await Promise.all(
		pageFiles
			.filter((file) => file.endsWith(".js"))
			.map(async (file) => {
				const pageName = file.split(".")[0]

				const template = import.meta.resolve(path.join(pagesDir, file))

				return new HtmlWebpackPlugin({
					filename: `${pageName}.html`,
					template,
				})
			})
	)

	return plugins
}

export default async (env, { mode }) => {
	const isDev = mode === "development"
	const pages = await generatePages(isDev)
	return {
		mode,
		entry: path.join(baseDir, "app.js"),
		output: {
			path: buildDir,
			filename: "[name].js",
			clean: true,
		},

		plugins: [...pages],
	}
}
