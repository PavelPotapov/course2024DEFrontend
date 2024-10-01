import { defaultProps } from "../config/index.js"

export const Button = ({ text }) => {
	const props = Object.assign({}, defaultProps, { text })

	return `
    <button class="btn" data-js-btn>
      <span class="btn__content">
        ${props.text}
      </span>
    </button>
  `
}
