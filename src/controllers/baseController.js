const baseController = {}

baseController.buildHome = async function (req, res, next) {
    res.render("index", { title: "Home" });
    // Assuming req.session.user is used somewhere else
    next();
}

baseController.buildReceipt = async function (req, res, next) {
    res.render("receipt", {
        title: "Receipt Form"
    });
    next();
}

module.exports = baseController;