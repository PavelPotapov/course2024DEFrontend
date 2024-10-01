import "./styles.js"
import { ButtonModel } from "@components/Button/model"

document.addEventListener("DOMContentLoaded", async () => {
	if (process.env.NODE_ENV === "development") {
		const { getMocks } = await import("@shared/api/lib/index.js")
		await getMocks()
		console.debug("MSW ready")
	}
	new ButtonModel()
})
