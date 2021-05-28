const Baileys = require("@adiwajshing/baileys");
const { WAConnection, MessageLogLevel, Presence } = Baileys;
const { info } = MessageLogLevel;
const fs = require("fs").promises;
const { join } = require("path");
const db = require("quick.db");
const { config } = global;
const save = require("./lib/config");
const subscribePresence = require("./lib/subscribePresence");

global.Baileys = Baileys;
global.db = db;

var start = main();
module.exports = start;

async function main() {
	const client = new WAConnection({ waitForChats: false, logLevel: MessageLogLevel.info });
	global.client = client;
	client.subscribePresence = subscribePresence;

	var eventLocation = join(__dirname, "events");

	(await fs.readdir(eventLocation)).forEach((file) => {
		var event = file.split(".")[0];
		var func = require(join(eventLocation, file));
		func = func.bind(client, client);

		client.on(event, func);
	});

	if (config.auth) {
		client.log("Logging in with saved credentials ...", info);
		client.loadAuthInfo(config.auth);
	} else {
		client.log("No saved credentials, logging in with QR Code", info);
	}

	try {
		await client.connect({
			timeoutMs: 30 * 1000,
			logLevel: MessageLogLevel.info,
		});
	} catch (error) {
		client.log("Invalid Credentials, you need to relogin", info);
		delete config.auth;
		save();

		return await main();
	}
	config.auth = client.base64EncodedAuthInfo();
	save();
	client.log("Saving credentials");

	setInterval(async () => {
		const presences = db.get("presence") || {};
		console.log("req request presences");
		let i = 0;

		for (const id of Object.keys(presences)) {
			var wait = sleep(Math.random() * 3000 + 3000);
			console.log(i++);
			await client
				.subscribePresence(id + "@c.us")
				.catch((error) => console.error("failed to request presence for: " + id, error));
			await wait;
		}
		console.log("finished: req request presences");
	}, 1000 * 60 * 15); // every 15 minutes

	return client;
}

async function sleep(ms) {
	return new Promise((res) => setTimeout(res, ms));
}
