/**
 * @param {import("express").Request} req
 */

module.exports = (req) => {
	return req.header("token") === global.config.admin;
};
