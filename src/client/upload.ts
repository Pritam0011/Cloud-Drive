const drop = document.querySelector<HTMLDivElement>(".drop-area");
const fileIpt = document.querySelector<HTMLInputElement>("#fileIpt");
const browseBtn = document.querySelector<HTMLButtonElement>(".browseBtn");
const proBar = document.querySelector<HTMLDivElement>(".prog-bar");
const perS = document.querySelector<HTMLDivElement>("#per");
const progCon = document.querySelector<HTMLDivElement>(".prog-con");
const ale = document.querySelector<HTMLDivElement>(".ale");

if (drop && fileIpt && browseBtn && proBar && perS && ale) {
	const showAle = (msg: string) => {
		let aleTimer: any;
		ale.innerHTML = `<b>${msg}</b>`;
		ale.style.transform = "translate(-50%,0)";
		clearTimeout(aleTimer);
		aleTimer = setTimeout(() => {
			ale.style.transform = "translate(-50%,-100px)";
		}, 2000);
	};

	drop.addEventListener("dragover", (e) => {
		e.preventDefault();
		if (!drop.classList.contains("dragged")) {
			drop.classList.add("dragged");
		}
	});

	drop.addEventListener("dragleave", () => {
		if (drop.classList.contains("dragged")) {
			drop.classList.remove("dragged");
		}
	});

	drop.addEventListener("drop", (e) => {
		e.preventDefault();
		drop.classList.remove("dragged");
		if (e.dataTransfer) {
			const files = e.dataTransfer.files;

			if (files.length) {
				fileIpt.files = files;

				upload(fileIpt.files[0]);
			}
		}
	});

	fileIpt.addEventListener("change", () => {
		if (fileIpt.files) {
			upload(fileIpt.files[0]);
		}
	});
	browseBtn.addEventListener("click", () => {
		fileIpt.click();
	});

	function upProg(e: any) {
		const per = Math.round((e.loaded / e.total) * 100);
		if (perS && proBar) {
			perS.innerText = `${per}`;
			proBar.style.transform = `scaleX(${per / 100})`;
		}
	}

	function upload(file: File) {
		if (progCon) progCon.style.display = "block";
		const formData = new FormData();
		formData.append("efile", file);

		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (progCon) progCon.style.display = "none";
				showAle(JSON.parse(xhr.response).message);
			}
		};

		xhr.upload.onprogress = upProg;
		xhr.upload.onerror = (e) => {
			if (fileIpt) fileIpt.value = "";
			showAle(`Error: ${xhr.statusText}`);
		};
		xhr.open("POST", "/send");
		xhr.send(formData);
	}
}
