console.log("Starting ...");
require("./lib/config");
require("./lib/array");

if (!global.config.dbpath) global.config.dbpath = __dirname + "/json.sqlite";

var client = require("./client");
var server = require("./server");

process.on("uncaughtException", (error) => {
	console.error(error);
	process.exit();
});
process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit();
});

module.exports = Promise.all([client, server]);
