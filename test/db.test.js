const db = require("../src/db");

// afterAll(() => {
//     db.resetDb();
// });

describe("In-memory DB functionality test", () => {
    test("addReceipt with valid receipt returns id", () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                {
                    shortDescription: "Doritos Nacho Cheese",
                    price: "3.35",
                },
            ],
            total: "3.35",
        };
        const id = db.addReceipt(receipt);
        expect(id).toMatch(/[A-Za-z0-9_-]{10}/);
    });

    test("addReceipt with invalid receipt returns null", () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "99:01",
            items: [
                {
                    shortDescription: "Doritos Nacho Cheese",
                    price: "3.35",
                },
            ],
            total: "3.35",
        };
        const id = db.addReceipt(receipt);
        expect(id).toBe(null);
    });

    test("getReceiptById with valid id returns receipt", () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                {
                    shortDescription: "Doritos Nacho Cheese",
                    price: "3.35",
                },
            ],
            total: "3.35",
        };

        const id = db.addReceipt(receipt);
        const receiptFromDb = db.getReceiptById(id);

        expect(receiptFromDb).toStrictEqual(receipt);
    });

    test("getReceiptById with invalid id returns falsy", () => {
        const receiptFromDb = db.getReceiptById("21");

        expect(receiptFromDb).toBeFalsy();
    });
});
