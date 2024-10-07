import { generateAttributes } from "#shared/lib/index.js"

export const Button = ({ text, extraAttrs = [] }) =>
	`<button class="btn" ${generateAttributes(extraAttrs)}>${text}</button>`
