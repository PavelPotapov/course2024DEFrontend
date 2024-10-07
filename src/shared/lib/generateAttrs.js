export const generateAttributes = (attributes = []) =>
	attributes.map((attr) => `${attr.name}="${attr.value}"`).join(" ")
