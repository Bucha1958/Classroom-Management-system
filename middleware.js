const middleware = (req, res, next) => {
    req.user ? next() : res.status(401).send("Unauthorized");
}

module.exports = middleware;