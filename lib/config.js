const fs = require("fs");
var oldConfig = require("../config.json");

if (oldConfig.environment) {
	var config = oldConfig[oldConfig.environment];
} else {
	throw new Error("Invalid environment in config");
}

global.config = config;

module.exports = function save() {
	fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(oldConfig, null, 4));
};
