// const { NodeSSH } = require("node-ssh");

// const ssh = new NodeSSH();
// ssh.connect({
// 	host: "REDACTED",
// 	username: "root",
// 	password: "REDACTED",
// })
// 	.then(() => {
// 		console.log("connected to phone");
// 	})
// 	.catch((e) => {
// 		console.error("couldn't connect to phone", e);
// 	});

module.exports = async function (id) {
	const phone = `${id}`.replace(/\D/g, "");
	const res = await this.requestPresenceUpdate(id);

	// try {
	// 	await ssh.execCommand(`uiopen whatsapp://send?phone=${phone}`);
	// } catch (error) {
	// 	console.error("couldn't open chat on phone", error);
	// }

	return res;
};
