export const wait = (ms = 100) => {
	return new Promise((res) => {
		setTimeout(res, ms)
	})
}
