const db = require("quick.db");
/** @param {import("express").Router} app */

module.exports = (app) => {
	app.get("/presences", async (req, res) => {
		const followers = db.get(`users.${req.user.id}.follower`) || {};
		const dbPresences = db.get(`presence`) || {};
		const presences = {};

		for (const id of Object.keys(followers)) {
			presences[id] = dbPresences[id];
		}

		res.json({ presences });
	});

	app.get("/presences/:id", async (req, res) => {
		const followers = db.get(`users.${req.user.id}.follower`) || {};
		if (!Object.keys(followers).includes(req.params.id)) throw "You didn't add the phone number";

		const presence = db.get(`presence.${req.params.id}`) || [];

		res.json({ presence });
	});
};
