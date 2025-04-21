import dotenv from "dotenv";
import express from "express";
import routes from "./routes";
import globalErrorHandler from "./middleware/error";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
app.use(globalErrorHandler);

export default app;
