const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = accountData;
        next();
    } catch (error) {
        console.error("Error verifying token", error);
        return res.status(403).json({ message: "Forbidden" });
    }
}

module.exports = authenticateToken;