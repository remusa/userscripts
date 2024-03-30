// ==UserScript==
// @name        !techinterviewhandbook.org - grind75 export
// @namespace   Violentmonkey Scripts
// @match       https://www.techinterviewhandbook.org/grind75*
// @grant       none
// @version     1.0
// @author      rms
// @description 3/20/2024, 1:14:49 AM
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// ==/UserScript==

function createElementExport(id, bottom, right, text) {
	const element = document.createElement("button");
	element.id = id;
	element.style.cssText = `position: fixed; bottom: ${bottom}px; right: ${right}px; cursor: pointer; border-radius: 5px; z-index: 100`;
	element.innerHTML = text;
	document.body.insertAdjacentElement("beforeend", element);

	document.querySelector(`#${id}`).addEventListener("click", () => {
		const completed = JSON.parse(
			window.localStorage.getItem("1:completedQuestions"),
		);
		const data = JSON.stringify({
			meta: {
				total: completed.length - 1,
				url: window.location.href,
			},
			completed,
		});
		const blob = new Blob([data], { type: "application/json" });
		const date = new Date().toISOString();
		saveAs(blob, `grind75_backup_${date}.json`);
	});
}

function createElementImport(id, bottom, right) {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = ".json";
	fileInput.style.cssText = `position: fixed; bottom: ${bottom}px; right: ${right}px; cursor: pointer; border-radius: 5px; z-index: 100`;
	document.body.insertAdjacentElement("beforeend", fileInput);

	fileInput.addEventListener("change", (event) => {
		const [file] = event.target.files;
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = (evt) => {
			const fileContents = evt.target.result;
			const {
				completed,
				meta: { url },
			} = JSON.parse(fileContents);
			const isStringArray = completed.every((txt) => {
				return typeof txt === "string";
			});
			if (!isStringArray) {
				return;
			}
			const data = JSON.stringify(completed);
			window.localStorage.setItem("1:completedQuestions", data);
			window.location.href = url;
		};
		reader.onerror = (evt) => {
			console.log("error reading file");
		};
	});
}

function onReady() {
	const completed =
		JSON.parse(window.localStorage.getItem("1:completedQuestions")).length - 1;
	const regex = /\d+/;
	const total = document
		.querySelector(".text-3xl.font-bold")
		.textContent.split(" ")
		.find((txt) => txt.match(regex));
	createElementExport("export", 10, 10, `Export 💾 (${completed}/${total}✔)`);
	createElementImport("import", 50, 10);
}

if (document.readyState !== "loading") {
	onReady();
} else {
	document.addEventListener("DOMContentLoaded", onReady);
}
