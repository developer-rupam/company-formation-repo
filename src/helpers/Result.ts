import { ErrorResponse } from "./ErrorResponse";

export class Result {
  private errorResponse?: ErrorResponse;
  private response?: any;
  private affectedRecords?:number;
  private lastRecordId?:string;
  private totalCount?:number;

  setErrorResponse(errorResponse: ErrorResponse) {
    this.errorResponse = errorResponse;
  }

  setResponse(response: any) {
    this.response = response;
  }

  setAffectedRecords(affectedRecords: number) {
    this.affectedRecords = affectedRecords;
  }
   getAffectedRecords():number|undefined {
    return this.affectedRecords;
  }
  setLastRecordId(lastRecordId: string) {
    this.lastRecordId = lastRecordId;
  }
  getLastRecordId():string|undefined {
    return this.lastRecordId;
  }
  setTotalCount(totalCount: number) {
    this.totalCount = totalCount;
  }
   getTotalCount():number|undefined {
    return this.totalCount;
  }

  getErrorResponse(): ErrorResponse | undefined {
    return this.errorResponse;
  }

  getResponse(): any | undefined {
    return this.response;
  }
}
