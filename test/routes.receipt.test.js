const request = require("supertest");
const express = require("express");
const receiptRoutes = require("../src/routes/receipt");

const app = express();
app.use(express.json());
app.use("/receipts", receiptRoutes);

describe("Receipt API Routes", () => {
    test("GET /:id/points with invalid id should return error msg", async () => {
        const res = await request(app).get("/receipts/abc/points");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
            "description",
            "No receipt found for that ID."
        );
    });

    test("GET /:id/points with valid id should return score", async () => {
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
        const res = await request(app).post("/receipts/process").send(receipt);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body.id).toMatch(/[A-Za-z0-9_-]{10}/);

        const get = await request(app).get(`/receipts/${res.body.id}/points`);

        expect(get.statusCode).toBe(200);
        expect(get.body).toHaveProperty("points");
        expect(get.body.points).toEqual(expect.any(Number));
    });

    test("POST /receipts/process with valid receipt should return receipt id", async () => {
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
        const res = await request(app).post("/receipts/process").send(receipt);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body.id).toMatch(/[A-Za-z0-9_-]{10}/);
    });

    test("POST /receipts/process with invalid receipt should return error msg", async () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            total: "3.35",
        };
        const res = await request(app).post("/receipts/process").send(receipt);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "description",
            "The receipt is invalid."
        );
    });
});
