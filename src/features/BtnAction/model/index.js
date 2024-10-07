export class BtnActionModel {
	constructor({ selector, asyncOperation, onSuccess, onError }) {
		this.button = document.querySelector(selector)

		if (!this.button) {
			throw new Error("Button not found")
		}

		this.#setInitialState()

		this.asyncOperation = asyncOperation || this.#defaultAsyncOperation
		this.onSuccess = onSuccess || this.#defaultSuccessHandler
		this.onError = onError || this.#defaultErrorHandler

		this.#bindEvents()
	}

	#setInitialState() {
		this.button.disabled = false
		this.button.classList.add("ready")
		this.button.textContent = "Click me!"
	}

	async #handleClick() {
		this.#setLoadingState()

		try {
			if (this.asyncOperation) {
				const result = await this.asyncOperation()
				this.#handleSuccess(result)
			}
		} catch (error) {
			this.#handleError(error)
		} finally {
			this.#resetState()
		}
	}

	#setLoadingState() {
		this.button.disabled = true
		this.button.textContent = "Loading..."
		this.button.classList.add("loading")
	}

	#resetState() {
		this.button.disabled = false
		this.button.textContent = "Click me!"
		this.button.classList.remove("loading")
	}

	#handleSuccess(result) {
		if (this.onSuccess) {
			this.onSuccess(result)
		}
		this.button.classList.add("success")
		this.button.textContent = "Success!"
	}

	#handleError(error) {
		if (this.onError) {
			this.onError(error)
		}
		this.button.classList.add("error")
		this.button.textContent = "Error!"
	}

	async #defaultAsyncOperation() {
		console.log("Default async operation: no operation provided.")
		return Promise.resolve()
	}

	#defaultSuccessHandler(result) {
		console.log("Default success handler: no handler provided.", result)
	}

	#defaultErrorHandler(error) {
		console.log("Default error handler: no handler provided.", error)
	}

	set asyncOperation(fn) {
		this._asyncOperation =
			fn && typeof fn === "function" ? fn : this.#defaultAsyncOperation
	}

	get asyncOperation() {
		return this._asyncOperation
	}

	set onSuccess(fn) {
		this._onSuccess = this._onSuccess =
			fn && typeof fn === "function" ? fn : this.#defaultSuccessHandler
	}

	get onSuccess() {
		return this._onSuccess
	}

	set onError(fn) {
		this._onError = this._onError =
			fn && typeof fn === "function" ? fn : this.#defaultErrorHandler
	}

	get onError() {
		return this._onError
	}

	#bindEvents() {
		this.button.addEventListener("click", () => this.#handleClick())
	}
}
