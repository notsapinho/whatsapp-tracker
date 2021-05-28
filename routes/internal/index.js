const { Router } = require("express");
const client = require("./client");
const errorHandler = require("../errorHandler");

/** @param {import("express").Router} app */

module.exports = (app) => {
	var router = Router();

	client(router);

	router.use(errorHandler);

	app.use("/internal/", router);
};
