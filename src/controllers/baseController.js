const baseController = {}
const ReceiptModel = require("../models/receiptModel");
const InvoiceModel = require("../models/invoiceModel");
const logger = require("../utils/logger");

baseController.buildHome = async function (req, res, next) {
    try {
        // Fetch statistics
        const receipts = await ReceiptModel.getReceipts();
        const invoices = await InvoiceModel.getInvoices();

        // If user is not an admin, show a simplified dashboard
        if (req.user && req.user.usertype && req.user.usertype !== 'admin') {
            const recentReceipts = receipts.slice(-5).reverse();
            const recentInvoices = invoices.slice(-5).reverse();
            
            // Calculate daily sales and balance
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todayReceipts = receipts.filter(r => {
                const receiptDate = new Date(r.created_at);
                receiptDate.setHours(0, 0, 0, 0);
                return receiptDate.getTime() === today.getTime();
            });
            
            const dailySales = todayReceipts.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
            const dailyBalance = todayReceipts.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0);
            const dailyAmountPaid = todayReceipts.reduce((sum, r) => sum + parseFloat(r.amount_paid || 0), 0);
            
            return res.render("simpleDashboard", {
                title: "Dashboard",
                user: req.user,
                recentReceipts,
                recentInvoices,
                receiptsCount: receipts.length,
                invoicesCount: invoices.length,
                dailySales: dailySales.toFixed(2),
                dailyBalance: dailyBalance.toFixed(2),
                dailyAmountPaid: dailyAmountPaid.toFixed(2),
                todayReceiptsCount: todayReceipts.length
            });
        }

        // Calculate stats
        const totalReceipts = receipts.length;
        const totalInvoices = invoices.length;
        
        const totalReceiptAmount = receipts.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
        const totalInvoiceAmount = invoices.reduce((sum, i) => sum + parseFloat(i.total || 0), 0);
        
        const totalReceiptBalance = receipts.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0);
        
        const paidInvoices = invoices.filter(i => i.status === 'paid').length;
        const sentInvoices = invoices.filter(i => i.status === 'sent').length;
        const draftInvoices = invoices.filter(i => i.status === 'draft').length;

        // Get recent items (last 5)
        const recentReceipts = receipts.slice(-5).reverse();
        const recentInvoices = invoices.slice(-5).reverse();

        res.render("dashboard", {
            title: "Dashboard",
            user: req.user,
            stats: {
                totalReceipts,
                totalInvoices,
                totalReceiptAmount: totalReceiptAmount.toFixed(2),
                totalInvoiceAmount: totalInvoiceAmount.toFixed(2),
                totalReceiptBalance: totalReceiptBalance.toFixed(2),
                paidInvoices,
                sentInvoices,
                draftInvoices
            },
            recentReceipts,
            recentInvoices
        });
    } catch (error) {
        logger.error(`Error in buildHome: ${error.message}`, error);
        next(error);
    }
}

baseController.buildReceipt = async function (req, res, next) {
    res.render("receipt", {
        title: "Receipt Form"
    });
    next();
}

// Build Sales Page - Classified by payment method
baseController.buildSalesPage = async function (req, res, next) {
    try {
        const receipts = await ReceiptModel.getReceipts();
        
        // Classify sales by payment method
        const salesByMethod = {
            cash: receipts.filter(r => r.mode_of_payment === 'cash'),
            'mobile money': receipts.filter(r => r.mode_of_payment === 'mobile money'),
            visa: receipts.filter(r => r.mode_of_payment === 'visa')
        };
        
        // Calculate totals for each payment method
        const methodTotals = {};
        for (const [method, items] of Object.entries(salesByMethod)) {
            methodTotals[method] = {
                count: items.length,
                totalSales: items.reduce((sum, r) => sum + parseFloat(r.total || 0), 0),
                totalAmountPaid: items.reduce((sum, r) => sum + parseFloat(r.amount_paid || 0), 0),
                totalBalance: items.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0)
            };
        }
        
        // Calculate grand totals
        const grandTotals = {
            totalReceipts: receipts.length,
            totalSales: receipts.reduce((sum, r) => sum + parseFloat(r.total || 0), 0),
            totalAmountPaid: receipts.reduce((sum, r) => sum + parseFloat(r.amount_paid || 0), 0),
            totalBalance: receipts.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0)
        };
        
        return res.render("sales", {
            title: "Sales Report",
            user: req.user,
            salesByMethod,
            methodTotals,
            grandTotals
        });
    } catch (error) {
        logger.error(`Error in buildSalesPage: ${error.message}`, error);
        next(error);
    }
}

module.exports = baseController;

// Render a blank page with logo (simple template)
baseController.buildBlank = async function (req, res, next) {
    try {
        return res.render('blank_template', {
            title: 'Blank',
            user: req.user
        });
    } catch (error) {
        logger.error(`Error in buildBlank: ${error.message}`, error);
        next(error);
    }
}