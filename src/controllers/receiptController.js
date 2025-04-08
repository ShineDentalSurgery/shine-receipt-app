const ReceiptItem = require("../models/receiptModel");

async function addReceipt(req, res) {
    const { patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance} = req.body;
    console.log("Received data:", { patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance}); // Add logging
    const receipt = await ReceiptItem.createReceipt(patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance);

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
        const data = await ReceiptItem.getReceipts(); // Fetch all receipts
        console.log(data);

        // Process services field for each receipt
        data.forEach(receipt => {
            if (typeof receipt.service === "string") {
                receipt.service = JSON.parse(receipt.service).join(", "); // Convert array string to a readable format
            }
        });

        res.render("receipts", {
            title: "Receipts List",
            receipts: data // Pass the processed receipt data to the view
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

        // Process services field for each receipt

        if (typeof data.service === "string") {
            data.service = JSON.parse(data.service).join(", "); // Convert array string to a readable format
        }


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

