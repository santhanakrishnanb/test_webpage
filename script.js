document.addEventListener("DOMContentLoaded", function () {
	fetch("data/daily_data.csv?cache_bust=" + Date.now())
		.then(response => {
			if (!response.ok) {
				throw new Error("Could not load CSV file.");
			}
			return response.text();
		})
		.then(csvData => {
			Papa.parse(csvData, {
				header: true,
				skipEmptyLines: true,
				complete: function (results) {
					displayData(results.data);
				}
			});
		})
		.catch(error => {
			const container = document.getElementById("content");
			container.innerHTML = `<p>Could not load updates.</p><p>${escapeHTML(error.message)}</p>`;
		});
});

function escapeHTML(value) {
	if (value === undefined || value === null) return "";

	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function displayData(data) {
	const container = document.getElementById("content");
	container.innerHTML = "";

	if (!data || data.length === 0) {
		container.innerHTML = "<p>No updates found.</p>";
		return;
	}

	data.forEach(row => {
		if (!row.title && !row.description && !row.image_filename) return;

		const itemDiv = document.createElement("div");
		itemDiv.className = "item";

		const title = escapeHTML(row.title);
		const description = escapeHTML(row.description);
		const imageFilename = escapeHTML(row.image_filename);

		let html = "";

		if (title) {
			html += `<h2>${title}</h2>`;
		}

		if (description) {
			html += `<p>${description}</p>`;
		}

		if (imageFilename) {
			html += `<img src="images/${imageFilename}" alt="${title || "Daily image"}">`;
		}

		itemDiv.innerHTML = html;
		container.appendChild(itemDiv);
	});
}
