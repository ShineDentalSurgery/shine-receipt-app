const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, receiptController.addReceipt);
router.post("/edit/:receipt_id", authenticateToken, receiptController.updateReceipt)
router.get("/", authenticateToken, receiptController.getAllReceipts);
router.delete("/delete/:receipt_id", authenticateToken, receiptController.deleteReciept);
router.get("/:receipt_id", authenticateToken, receiptController.receiptDetails);


module.exports = router;
