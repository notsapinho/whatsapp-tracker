const db = require("quick.db");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { config } = require("process");
const generateToken = promisify(jwt.sign);
const check = require("./internal/check");

/** @param {import("express").Router} app */

module.exports = (app) => {
	app.post("/register", async (req, res) => {
		if (req.headers.authorization) {
			var token = (req.headers.authorization || "").split(" ")[1];
			try {
				var valid = await jwt.verify(token, global.config.jwt, { algorithms: ["HS256"] });
				var user = db.get(`users.${valid.id}`);
				if (!user) throw "user not in database";
			} catch (error) {
				var valid = false;
			}

			if (valid) {
				const { name, nameLock } = user;
				return res.json({ user: { ...valid, name, nameLock }, token });
			}
		}
		throw "Whatstracker disabled";

		const { config } = global;
		var id = uuidv4();
		var user = { id, type: "user" };

		db.set(`users.${id}`, { ...user, follower: {}, notifications: {} });

		var token = await generateToken(user, config.jwt, { algorithm: "HS256" });

		res.json({ user, token });
	});

	app.post("/login", async (req, res) => {
		if (!req.body) throw "invalid request body";
		const { name } = req.body;
		const { config } = global;
		// name === null -> also fail
		if (!name && typeof name !== "string") throw "Please enter a valid name";

		const users = Object.values(db.get("users") || {});
		const user = users.find((user) => (user.name || "").toLowerCase() === name.toLowerCase());
		if (!user) throw "That user doesn't exist";
		const token = await generateToken({ id: user.id, type: "user" }, config.jwt, { algorithm: "HS256" });

		return res.json({ user, token });
	});

	app.patch("/user/name", (req, res) => {
		if (!req.body) throw "invalid request body";
		const { name } = req.body;
		if (!name || typeof name !== "string") throw "Please enter a valid name";

		const users = Object.values(db.get("users") || {});
		if (users.find((user) => (user.name || "".toLowerCase()) === name.toLowerCase() && user.id !== req.user.id))
			throw "A user with this name already exists";

		if (db.get(`users.${req.user.id}.nameLock`)) throw "You can't change the username, because its locked";

		db.set(`users.${req.user.id}.name`, name);

		res.json({ success: true });
	});

	app.patch("/user/lock", (req, res) => {
		db.set(`users.${req.user.id}.nameLock`, true);

		res.json({ success: true });
	});

	app.post("/user/notifications", async (req, res) => {
		if (!req.body) throw "invalid request body";
		const { type, endpoint, auth, p256dh } = req.body;
		if (!type || typeof type !== "string") throw "Please enter a valid type";
		if (!endpoint || typeof endpoint !== "string") throw "Please enter a valid endpoint";
		if (!auth || typeof auth !== "string") throw "Please enter a valid auth";
		if (!p256dh || typeof p256dh !== "string") throw "Please enter a valid p256dh";
		const id = uuidv4();

		db.set(`users.${req.user.id}.notifications.${id}`, { type, endpoint, auth, p256dh });

		res.json({ success: true });
	});
};
