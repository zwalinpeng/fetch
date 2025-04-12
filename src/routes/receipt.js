const express = require("express");
const db = require("../db");
const receiptUtil = require("../util/receiptUtil");
const router = express.Router();

// GET /receipts/{id}/points
router.get("/:id/points", (req, res) => {
    try {
        const receipt = db.getReceiptById(req.params.id);
        if (receipt) {
            const points = receiptUtil.calculatePoints(receipt);
            res.status(200).json({ points: points });
        } else {
            res.status(404).json({
                description: "No receipt found for that ID.",
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /receipts/process
router.post("/process", (req, res) => {
    try {
        const data = req.body;
        const id = db.addReceipt(data);
        if (id) {
            res.status(200).json({ id: id });
        } else {
            res.status(400).json({ description: "The receipt is invalid." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
