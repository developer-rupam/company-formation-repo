import express, { Router } from "express";
import { userRouter,directoryRouter,employeeRouter,emailTemplateRouter } from "../api/index";

const rootRouter = Router();

rootRouter.use(express.json());
rootRouter.use(express.urlencoded({ extended: true }));

rootRouter.use("/user", userRouter);
rootRouter.use("/directory", directoryRouter);
rootRouter.use("/employee", employeeRouter);
rootRouter.use("/email_template", emailTemplateRouter);

export { rootRouter };
