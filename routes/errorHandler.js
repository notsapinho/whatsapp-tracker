/**
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

module.exports = (err, req, res, next) => {
	if (!err) return next();
	res.status(400);
	res.json({ error: err.toString() });
};
