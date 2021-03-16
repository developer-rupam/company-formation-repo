import { ResponseTypes } from "./ResponseTypes";
import { StatusCodes } from "./StatusCodes";

export class ErrorResponse {
  private errorStatusCode?: StatusCodes;
  private errorStatusType?: ResponseTypes;
  private errorHttpStatus?: number;
  private errorMessage: string;

  public getErrorHttpStatus(): number | undefined {
    return this.errorHttpStatus;
  }
  public setErrorHttpStatus(errorHttpStatus: number) {
    this.errorHttpStatus = errorHttpStatus;
  }

  constructor(errorMessage: string = "Some Error Occured") {
    this.errorMessage = errorMessage;
  }

  setErrorStatusCode(errorStatusCode: StatusCodes) {
    this.errorStatusCode = errorStatusCode;
  }

  getErrorStatusCode() {
    return this.errorStatusCode;
  }

  setErrorStatusType(errorStatusType: ResponseTypes) {
    this.errorStatusType = errorStatusType;
  }

  getErrorStatusType() {
    return this.errorStatusType;
  }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}
