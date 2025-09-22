const initializeDatabase = require("../config/db");

async function createReceipt(patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance) {
    const db = await initializeDatabase();
    try {
        const sql = "INSERT INTO receipts (patient_name, patient_phone, service, total, mode_of_payment,amount_paid, balance) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [result] = await db.query(sql, [patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance]);
        return result; // Return the result
    } catch (error) {
        console.error("Error adding receipt:", error);
        return null;
    } finally {
        await db.end();
    }
}

async function getReceiptDetails(id) {
    const db = await initializeDatabase();
    try {
        const [result] = await db.query(
            `SELECT * FROM receipts WHERE id = ?`,
            [id]
        );
        console.log("query results: ", result);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("get receipt details error:", error);
        throw new Error("failed to retrieve receipt details");
    } finally {
        await db.end();
    }
}

async function getReceipts() {
    const db = await initializeDatabase();
    try {
        const [result] = await db.query("SELECT * FROM receipts ORDER BY id");
        return result;
    } catch (error) {
        console.error("Error fetching receipts:", error);
        throw error;
    } finally {
        await db.end();
    }
}

async function deleteReceipt(id) {
    const db = await initializeDatabase();
    try {
        const [result] = await db.query("DELETE FROM receipts WHERE id = ?", [id]);
        return result.affectedRows > 0; // Returns true if a row was deleted
    } catch (error) {
        console.error("Error deleting receipt:", error);
        throw error;
    } finally {
        await db.end();
    }
}

async function updateReceipt(id, patient_name, patient_phone, service, total, mode_of_payment, amount_paid, balance) {
    const db = await initializeDatabase();
    try {
        const sql = `
            UPDATE receipts
            SET patient_name = ?, patient_phone = ?, service = ?, total = ?, mode_of_payment = ?, amount_paid = ?, balance = ?
            WHERE id = ?
        `;
        const [result] = await db.query(sql, [
            patient_name,
            patient_phone,
            service,
            total,
            mode_of_payment,
            amount_paid,
            balance,
            id
        ]);
        return result.affectedRows > 0; // Returns true if a row was updated
    } catch (error) {
        console.error("Error updating receipt:", error);
        throw error;
    } finally {
        await db.end();
    }
}

module.exports = { createReceipt, getReceiptDetails, getReceipts, deleteReceipt, updateReceipt };
