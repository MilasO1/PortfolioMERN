const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const errorHandler = require("./middleware/errorHandler");
const morganMiddleware = require("./middleware/morganMiddleware");

const app = express();

dotenv.config();
app.use(morganMiddleware);
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

module.exports = app;