import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import { rootRouter } from "../src/routes/api";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares";
import { createMongooseConnection } from "./database/configs/mongoose";


const app = express();


createMongooseConnection().catch((error) => {
  throw error;
});
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1", rootRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
