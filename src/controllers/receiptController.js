const ReceiptItem = require("../models/receiptModel");

async function addReceipt(req, res) {
    const { patient_name, phone_number, services, total } = req.body;
    console.log("Received data:", { patient_name, phone_number, services, total }); // Add logging
    const receipt = await ReceiptItem.createReceipt(patient_name, phone_number, services, total);
    
    if (receipt) {
        const data = await ReceiptItem.getReceipts();
        res.status(201).render("receipts", { 
            title: "Receipts",
            receipts: data // Pass the receipt data to the view
        });
    } else {
        res.status(500).json({ message: "Error adding receipt" });
    }    
}

async function getAllReceipts(req, res, next) {
    try {
        const data = await ReceiptItem.getReceipts();
        console.log(data);
        res.render("receipts", {
            title: "Receipts List",
            receipts: data // Pass the receipt data to the view
        });
    } catch (error) {
        console.error("Error fetching receipts:", error);
        next(error);
    }
}

async function receiptDetails(req, res, next) {
    try {
        const receipt_id = req.params.receipt_id;
        const data = await ReceiptItem.getReceiptDetails(receipt_id);
        console.log("controller details: ", data);

        if (!data) {
            return res.status(404).json({ message: "Receipt not found" });
        }

        res.render("receiptDetails", {
            title: "Receipt Details",
            receipt: data,
        });
    } catch (error) {
        console.error("Error fetching receipt details:", error);
        next(error);
    }
}

module.exports = { addReceipt, getAllReceipts, receiptDetails };

