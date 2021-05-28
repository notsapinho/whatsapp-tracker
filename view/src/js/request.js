import errorLogo from "../assets/error.png";

export default async function request(path = "/", opts = {}) {
	var BASE_URL = window.location.origin || "https://whatstracker.app";
	var TOKEN = localStorage.getItem("token");
	var HEADERS = { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" };
	if (!TOKEN) delete HEADERS.authorization;

	if (opts.headers) {
		opts.headers = { ...opts.headers, ...HEADERS };
	} else opts.headers = HEADERS;

	if (typeof opts.body === "object") {
		try {
			opts.body = JSON.stringify(opts.body);
		} catch {}
	}

	try {
		var response = await fetch(`${BASE_URL}/api${path}`, opts);
		var text = await response.text();

		var json = JSON.parse(text);
		if (json.error) {
			text = json;
			throw json.error;
		}
		return json;
	} catch (error) {
		window.app.notification
			.create({
				icon: `<img src="${errorLogo}" />`,
				title: "Error",
				subtitle: error,
				closeOnClick: true,
				closeTimeout: 4000,
			})
			.open();
		throw text;
	}
}

// var TOKEN = localStorage.getItem("token");

// window.onbeforeunload = () => {
// 	localStorage.setItem("token", TOKEN);
// };
