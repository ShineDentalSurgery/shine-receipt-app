const User = require("../models/accounts-model");

async function adminMiddleware(req, res, next) {
    try {
        // Allow admin to delete and edit data without JWT token validation
        next();
    } catch (error) {
        console.error("Error in adminMiddleware:", error);
        res.status(403).json({ message: "Access denied." });
    }
}

module.exports = adminMiddleware;