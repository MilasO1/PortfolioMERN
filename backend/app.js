import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import morganMiddleware from "./middleware/morganMiddleware.js";

const app = express();

config();
app.use(morganMiddleware);
app.use(json());
app.use(helmet());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);

app.use(errorHandler);

export default app;