import foxImage from "@assets/fox.jpg"

export class Card {
	constructor() {
		console.debug("card init =>")
		const img = document.createElement("img")
		img.src = foxImage
		document.body.appendChild(img)
	}
}
