const db = require("quick.db");
const webpush = require("web-push");
const { private, public } = global.config.notificationKeys;

webpush.setVapidDetails("mailto:support@whatstracker.app", public, private);

/**
 *
 * @param {import('@adiwajshing/baileys').WAConnection} client
 * @param {import('@adiwajshing/baileys').PresenceUpdate} update
 */

module.exports = async (client, update) => {
	try {
		var id = update.id.replace(/\D/g, "");
		var presences = db.get(`presence.${id}`);
		var status = "";

		if (!presences) return; // user presence doesn't exist

		if (update.type === "available") {
			status = "online";
			if (presences.last && presences.last.to == presences.last.from) {
				return; // went online event got dispatched, but the user never was offline in the first place
			}
			presences.push({ from: Date.now(), to: Date.now() });
		} else if (update.type === "unavailable") {
			status = "offline";
			if (presences.last && presences.last.to == presences.last.from) {
				presences.last.to = Date.now();
			} else {
				return; // there is no online event that matches the offline event
			}
		} else return;

		db.set(`presence.${id}`, presences);

		const dbUsers = Object.values(db.get("users") || {});
		const users = dbUsers.filter((user) => {
			var f = (user.follower || {})[id];
			return f && f.notifications;
		});

		const names = dbUsers
			.map((user) => (user.follower || {})[id])
			.filter((x) => x)
			.map((x) => x.name);

		console.log(`[${new Date().toLocaleString()}] +${id} just went ${status} (${names.join(", ")})`);

		// do not use for loops, because all notifications should be sent at the same time
		users.forEach(async (user) => {
			for (const [notifyID, notification] of Object.entries(user.notifications || {})) {
				switch (notification.type) {
					case "browser":
						const { name } = user.follower[id];
						const { endpoint, auth, p256dh } = notification;
						const pushSubscription = {
							endpoint,
							keys: {
								auth,
								p256dh,
							},
						};

						await webpush
							.sendNotification(pushSubscription, JSON.stringify({ type: "presence", id, name, status }))
							.catch((e) => {
								console.log(`delete for ${user.id} notify: ${notifyID}`);
								db.delete(`users.${id}.notifications.${notifyID}`);
							});

						break;
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
};
