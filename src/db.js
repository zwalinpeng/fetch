const { nanoid } = require("nanoid");
const receiptUtil = require("./util/receiptUtil");

// in-memory db
const db = {};

// generate receipt id matching ^[A-Za-z0-9_-]{10}$
function generateId() {
    return nanoid(10);
}

function getReceiptById(id) {
    const receipt = db[id];
    return receipt;
}

function addReceipt(receipt) {
    // validate receipt to avoid inserting invalid data
    if (receiptUtil.validateReceipt(receipt)) {
        const id = generateId();
        db[id] = receipt;
        return id;
    }
    return null;
}

module.exports = { getReceiptById, addReceipt };
