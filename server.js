const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();
const port = global.config.port || 3000;
const fs = require("fs");
const jwt = require("express-jwt");
const user = require("./routes/user");
const follower = require("./routes/follower");
const presence = require("./routes/presence");
const internal = require("./routes/internal");
const errorHandler = require("./routes/errorHandler");
app.use(bodyParser.json());
const { config } = global;
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = new Promise(async (res) => {
	var router = express.Router();
	var route = config.dev ? "/api/" : "/";

	app.use(helmet({ contentSecurityPolicy: !!config.prod }));
	router.use(
		"/",
		jwt({ secret: config.jwt, algorithms: ["HS256"] }).unless({
			path: [`${route}register`, `${route}login`, /\/internal\/*/],
		})
	);

	follower(router);
	user(router);
	presence(router);
	internal(router);
	router.use(errorHandler);
	app.use(route, router);

	if (config.dev) app.use(createProxyMiddleware({ target: "http://localhost:8080", ws: true }));

	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`);
		res(app);
	});
});
