const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.post("/create", receiptController.addReceipt);
router.get("/", receiptController.getAllReceipts);
router.get("/:receipt_id", receiptController.receiptDetails);

module.exports = router;
