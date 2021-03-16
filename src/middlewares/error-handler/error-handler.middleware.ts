import { Request, Response, NextFunction } from "express";
import { Result } from "../../helpers/Result";
import { ErrorResponse } from "../../helpers/ErrorResponse";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { StatusCodes } from "../../helpers/StatusCodes";

export const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction): void => {
  
  const errorHttpStatus = error.errorHttpStatus || 500;
  const errorHttpStatusType = error.errorHttpStatusType || ResponseTypes.FAILED;
  const errorResponse = new ErrorResponse("Some Error Occured");
  const result = new Result();

  errorResponse.setErrorHttpStatus(errorHttpStatus);
  errorResponse.setErrorStatusCode(StatusCodes.FAILURE);
  errorResponse.setErrorStatusType(errorHttpStatusType);

  result.setErrorResponse(errorResponse);
  result.setResponse(null);

  res.status(errorHttpStatus).json(result);
};
