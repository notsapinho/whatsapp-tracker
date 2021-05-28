const { MessageLogLevel } = require("@adiwajshing/baileys");
const db = require("quick.db");

/**
 *
 * @param {import('@adiwajshing/baileys').WAConnection} client
 */

module.exports = async (client) => {
	try {
		client.log(`Client ready as ${client.user.name} (${client.user.jid})`, MessageLogLevel.info);

		var users = db.get("presence") || {};
		var i = 0;
		await sleep(5000);
		console.log("requesting presences");

		for (var id in users) {
			console.log(i++);
			await sleep(Math.random() * 2000 + 2000);
			await client
				.subscribePresence(id + "@c.us")
				.catch((error) => console.error("failed to request presence for: " + id, error));
		}
		console.log("finished requesting presences");
	} catch (error) {
		console.error;
	}
};

async function sleep(ms) {
	return new Promise((res) => setTimeout(res, ms));
}
