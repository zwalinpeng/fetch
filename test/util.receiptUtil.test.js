const receiptUtil = require("../src/util/receiptUtil");

describe("Test calculatePoints()", () => {
    test("+1 for every alphanumeric character in retailer name", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "11:33",
            items: [],
            total: "9.99",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(5);
    });
    test("+75 for round total", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "11:33",
            items: [],
            total: "9.00",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(80);
    });
    test("+25 for total multiple of 0.25", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "11:33",
            items: [],
            total: "9.25",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(30);
    });
    test("+5 for every 2 items", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "11:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.99",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(15);
    });
    test("+price * 0.2 rounded up if trimmed desc is multiple of 3", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "11:33",
            items: [
                {
                    shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                    price: "12.00",
                },
            ],
            total: "9.99",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(8);
    });
    test("+6 for odd date", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-21",
            purchaseTime: "11:33",
            items: [],
            total: "9.99",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(11);
    });
    test("+10 for time between 2:00pm and 4:00pm", () => {
        const receipt = {
            retailer: "T4-get",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            items: [],
            total: "9.99",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(15);
    });
    test("Example 1", () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                {
                    shortDescription: "Mountain Dew 12PK",
                    price: "6.49",
                },
                {
                    shortDescription: "Emils Cheese Pizza",
                    price: "12.25",
                },
                {
                    shortDescription: "Knorr Creamy Chicken",
                    price: "1.26",
                },
                {
                    shortDescription: "Doritos Nacho Cheese",
                    price: "3.35",
                },
                {
                    shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                    price: "12.00",
                },
            ],
            total: "35.35",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(28);
    });

    test("Example 2", () => {
        const receipt = {
            retailer: "M&M Corner Market",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.calculatePoints(receipt)).toBe(109);
    });
});

describe("Test validateReceipt()", () => {
    test("Valid receipt should return true", () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                {
                    shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                    price: "12.00",
                },
            ],
            total: "35.35",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(true);
    });

    test("Receipt with invalid retailer name should return false", () => {
        const receipt = {
            retailer: "@_!902 Store",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt missing items field should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt with invalid date format should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "9999-99-99",
            purchaseTime: "14:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt with invalid time should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "2022-03-20",
            purchaseTime: "99:99",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt with invalid time format should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "2022-03-20",
            purchaseTime: "12:22AM",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt with invalid total should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2.25",
                },
            ],
            total: "9",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });

    test("Receipt with invalid item price should return false", () => {
        const receipt = {
            retailer: "CVS",
            purchaseDate: "2022-03-20",
            purchaseTime: "14:33",
            items: [
                {
                    shortDescription: "Gatorade",
                    price: "2",
                },
            ],
            total: "9.00",
        };
        expect(receiptUtil.validateReceipt(receipt)).toBe(false);
    });
});
