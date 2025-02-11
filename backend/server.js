const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
dotenv.config();

connectDb();

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})