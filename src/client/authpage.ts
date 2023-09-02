const signIn = document.querySelector<HTMLDivElement>("#signin");
const signUp = document.querySelector<HTMLDivElement>("#signup");
const signupForm = document.querySelector<HTMLFormElement>("#formField1");
const signinForm = document.querySelector<HTMLFormElement>("#formField2");

if (signIn && signUp && signupForm && signinForm) {
	signIn.addEventListener("click", () => {
		signIn.style.backgroundColor = "#333";
		signUp.style.backgroundColor = "#222";
		signinForm.style.display = "flex";
		signupForm.style.display = "none";
	});

	signUp.addEventListener("click", () => {
		signUp.style.backgroundColor = "#333";
		signIn.style.backgroundColor = "#222";
		signupForm.style.display = "flex";
		signinForm.style.display = "none";
	});
}

//capitalized
const input = document.querySelector<HTMLInputElement>("#nameInp");
if (input) {
	input.addEventListener("input", function () {
		const currentValue = input.value;
		if (currentValue.length > 0) {
			input.value = capitalizeWords(currentValue);
		}
	});

	function capitalizeWords(text: string) {
		return text.replace(/\b\w/g, (firstLetter) => firstLetter.toUpperCase());
	}
}

//password show button
const passwordInput = <any>document.getElementById("passwordField");
const showHideBtn = document.getElementById("showHideBtn");
const passwordInput2 = <any>document.getElementById("passwordField2");
const showHideBtn2 = document.getElementById("showHideBtn2");

if (passwordInput && showHideBtn && passwordInput2 && showHideBtn2) {
	showHideBtn.addEventListener("click", () => {
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			showHideBtn.textContent = "visibility_off";
		} else {
			passwordInput.type = "password";
			showHideBtn.textContent = "visibility";
		}
	});
	showHideBtn2.addEventListener("click", () => {
		if (passwordInput2.type === "password") {
			passwordInput2.type = "text";
			showHideBtn2.textContent = "visibility_off";
		} else {
			passwordInput2.type = "password";
			showHideBtn2.textContent = "visibility";
		}
	});
}
