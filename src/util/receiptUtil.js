const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const itemSchema = {
    $id: "item",
    type: "object",
    required: ["shortDescription", "price"],
    properties: {
        shortDescription: {
            type: "string",
            pattern: "^[\\w\\s\\-]+$",
        },
        price: {
            type: "string",
            pattern: "^\\d+\\.\\d{2}$",
        },
    },
};

const receiptSchema = {
    $id: "receipt",
    type: "object",
    required: ["retailer", "purchaseDate", "purchaseTime", "items", "total"],
    properties: {
        retailer: {
            type: "string",
            pattern: "^[\\w\\s\\-&]+$",
        },
        purchaseDate: {
            type: "string",
            format: "date",
        },
        purchaseTime: {
            type: "string",
            pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$",
        },
        items: {
            type: "array",
            minItems: 1,
            items: { $ref: "item" },
        },
        total: {
            type: "string",
            pattern: "^\\d+\\.\\d{2}$",
        },
    },
};

// create validator for schema
ajv.addSchema(itemSchema, "item");
ajv.addSchema(receiptSchema, "receipt");
const validate = ajv.getSchema("receipt");

// validate receipt against schema
function validateReceipt(receipt) {
    return validate(receipt);
}

// calculate receipt points
// * assumes valid receipt as points should only be calculated for valid receipt
function calculatePoints(receipt) {
    let points = 0;
    // +1 for every alphanumeric char in retailer name
    points += receipt.retailer.match(/[a-zA-Z0-9]/g).length;
    // +50 if the total is a round dollar amount with no cents
    points += receipt.total.slice(-2) == "00" ? 50 : 0;
    // +25 if the total is a multiple of 0.25
    points += receipt.total % 0.25 == 0 ? 25 : 0;
    // +5 for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;
    // +6 if the day in the purchase date is odd
    points += receipt.purchaseDate.slice(-2) % 2 == 1 ? 6 : 0;
    // + 10 points if the time of purchase is after 2:00pm and before 4:00pm
    points +=
        receipt.purchaseTime.replace(":", "") > 1400 &&
        receipt.purchaseTime.replace(":", "") < 1600
            ? 10
            : 0;
    // +price*0.2 rounded up if trimmed desc length % 3 == 0
    for (const item of receipt.items) {
        if (item.shortDescription.trim().length % 3 == 0) {
            points += Math.ceil(item.price * 0.2);
        }
    }
    return points;
}

module.exports = { calculatePoints, validateReceipt };
