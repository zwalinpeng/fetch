const express = require("express");
const app = express();
const port = 3000;

// json parsing
app.use(express.json());

// import routes
const receiptRoutes = require("./routes/receipts");
app.use("/receipts", receiptRoutes);

// root
app.get("/", (req, res) => {
    res.send("fetch!");
});

// start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
