const db = require("quick.db");
const check = require("./check");

/** @param {import("express").Router} app */

module.exports = (app) => {
	var requestFollowerCounter = 0;
	var maxRequestFollowerCounter = Object.keys(db.get("presence") || {}).length;

	app.get("/chat", async (req, res) => {
		if (!check(req)) return;
		const presences = db.get("presence") || {};
		const users = Object.keys(presences);
		const length = users.length;

		if (maxRequestFollowerCounter < length) {
			var id = users[maxRequestFollowerCounter++];
		} else {
			if (requestFollowerCounter >= length) {
				requestFollowerCounter = 0;
			}

			var id = users[requestFollowerCounter++];
		}

		return res.send(id);
	});
};
