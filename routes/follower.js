const db = require("quick.db");
const fetch = require("node-fetch");
const { v4: uuid } = require("uuid");
const saveConfig = require("../lib/config");

/** @param {import("express").Router} app */
const addToContacts = false;

module.exports = (app) => {
	app.get("/follower", async (req, res) => {
		const follower = db.get(`users.${req.user.id}.follower`) || {};
		const presences = db.get("presence") || {};

		await Promise.all(
			Object.values(follower).map(async (follower) => {
				const presence = presences[follower.id];
				follower.lastonline = false;
				if (presence) {
					const lastonline = presence.reverse().find((x) => x.type === "online");
					if (lastonline) {
						follower.lastonline = lastonline.date;
					}
				}

				try {
					follower.avatar = await client.getProfilePicture(follower.id);
				} catch (error) {
					follower.avatar = "https://i.imgur.com/4GuKF3V.png";
				}
			})
		);

		res.json({ follower });
	});

	app.post("/follower", async (req, res) => {
		const { client } = global;

		if (!req.body) throw "invalid request body";
		var { phone, name } = req.body;
		if (!phone || typeof phone !== "string") throw "Please enter a phone number";
		if (!name || typeof name !== "string") throw "Please enter a name";
		phone = phone.replace(/\D/g, "");
		var id = phone + "@s.whatsapp.net";
		const notifications = false;

		const exists = db.get(`users.${req.user.id}.follower.${phone}`);
		if (exists) throw "You already add the phone number";

		const isOnWhatsApp = await client.isOnWhatsApp(id);
		if (!isOnWhatsApp) throw "Phone number is not on WhatsApp";

		if (db.get(`users.${req.user.id}.nameLock`)) throw "You can't create a new contact, because it's locked";

		const followers = Object.keys(db.get(`users.${req.user.id}.follower`) || {}).length;
		if (followers >= 15) throw "Sorry you can't add more than 15 people";

		db.set(`users.${req.user.id}.follower.${phone}`, { id: phone, name, notifications });
		db.set(`presence.${phone}`, []);

		if (!db.get(`presence.${phone}`)) {
			await client.subscribePresence(phone + "@c.us");
		}

		try {
			var avatar = await client.getProfilePicture(phone);
		} catch (error) {
			var avatar = "https://i.imgur.com/4GuKF3V.png";
		}

		res.json({ id: phone, name, avatar, notifications });
	});

	app.delete("/follower", async (req, res) => {
		const { client } = global;

		if (!req.body) throw "invalid request body";
		var { id } = req.body;
		if (!id || typeof id !== "string") throw "Please enter a valid id";

		const isFollowing = db.get(`users.${req.user.id}.follower.${id}`);
		if (!isFollowing) throw "You didn't add the phone number";
		if (db.get(`users.${req.user.id}.nameLock`)) throw "You can't delete the contact, because it's locked";

		db.delete(`users.${req.user.id}.follower.${id}`);
		const users = db.get("users") || {};
		const otherUserAlsoTrackingNumber = Object.values(users).find((user) =>
			Object.keys(user.follower).includes(id)
		);
		if (!otherUserAlsoTrackingNumber) {
			db.delete(`presence.${id}`);
		}

		res.json({ success: true });
	});

	app.patch("/follower", async (req, res) => {
		const { client } = global;

		if (!req.body) throw "invalid request body";
		var { id, name, notifications } = req.body;
		if (!id || typeof id !== "string") throw "Please enter a valid id";
		if (!name || typeof name !== "string") throw "Please enter a name";
		if (typeof notifications !== "boolean") throw "Please enter notifications";

		const follower = db.get(`users.${req.user.id}.follower.${id}`);
		if (!follower) throw "You didn't add the phone number";

		if (db.get(`users.${req.user.id}.nameLock`) && name !== follower.name)
			throw "You can't change the name, because it's locked";

		const newFollower = { id, name, notifications };

		db.set(`users.${req.user.id}.follower.${id}`, newFollower);

		res.json({ success: true });
	});
};
