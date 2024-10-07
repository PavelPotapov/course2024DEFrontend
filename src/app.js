import { BtnActionModel } from "#features/BtnAction/index.js"
import {
	API_ENDPOINTS,
	BASE_URL,
	API_URL,
} from "#shared/config/constants/index.js"
import "./styles.js"

async function init() {
	if (process.env.NODE_ENV === "development") {
		const { getMocks } = await import("./shared/api/lib/index.js")
		await getMocks()
		console.debug("MSW ready")
	}
}

function domReady() {
	return new Promise((resolve) => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", resolve)
		} else {
			resolve()
		}
	})
}

Promise.all([domReady(), init()]).then(() => {
	const btnActionGetNews = new BtnActionModel({
		selector: `[data-js-btn-action="getNews"]`,
		asyncOperation: () =>
			fetch(`${BASE_URL}${API_URL}/${API_ENDPOINTS.posts.news}`).then((res) =>
				res.json()
			),
		onSuccess: (res) => console.debug(res),
		onError: (err) => console.error(err),
	})
})
