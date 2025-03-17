const baseController = require("../controllers/baseController");
const express = require("express");
const router = express.Router();


router.get("/", baseController.buildHome);
router.get("/receipt", baseController.buildReceipt);

module.exports = router;