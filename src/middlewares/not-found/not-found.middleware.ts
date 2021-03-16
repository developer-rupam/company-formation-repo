import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../helpers/StatusCodes";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import httpStatus from "http-status";

export const notFoundMiddleware = (req: Request,res: Response,next: NextFunction): void => {
  const error = {
    errorHttpStatus: httpStatus.NOT_FOUND,
    errorHttpStatusType: ResponseTypes.ROUTE_NOT_FOUND_ERROR,
  };

  next(error);
};
