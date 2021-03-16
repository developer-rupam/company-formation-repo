import { ErrorResponse } from "../../helpers/ErrorResponse";
import { Result } from "../../helpers/Result";
import * as EmployeeRepo from "./Employee.Repo";
import { IEmployee } from "./Employee.Model";
import httpStatus from "http-status";
import { StatusCodes } from "../../helpers/StatusCodes";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { IRequestJson } from "../../helpers/RequestJson";

export const createEmployee = async (employees: Array<IEmployee>) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    let employeeIdArray:Array<string>=[];
    for (let employee of employees) {
      employee.employee_id = "EM-" + new Date().getTime().toString();
      const employeeResult: IEmployee = await EmployeeRepo.createEmployee(employee);
      employeeIdArray.push(employeeResult.employee_id);
    }

    if (employeeIdArray.length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result['lastInsertedIds']=employeeIdArray;
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.FAILURE);
      errorResponse.setErrorStatusType(ResponseTypes.FAILED);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};
export const employeeLogin = async (employee: IEmployee) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const employeeResult = await EmployeeRepo.getEmployeeByEmployeeEmail(employee.employee_email);
    if (
      employeeResult !== null &&
      employeeResult.employee_password === employee.employee_password) {
      delete employeeResult.employee_password;
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(employeeResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.FAILURE);
      errorResponse.setErrorStatusType(ResponseTypes.FAILED);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};
export const getAllEmployees = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const employeeResult:Array<IEmployee> = await EmployeeRepo.getAllEmployees(requestJson.page_no,requestJson.page_size); 
    if (employeeResult!== null && employeeResult.length>1) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(employeeResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};
export const updateEmployeeById = async (employee: IEmployee) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const employeeResult:number = await EmployeeRepo.updateEmployeeById(employee)
    if ( employeeResult>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setAffectedRecords(employeeResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};
export const removeEmployeeById = async (employee: IEmployee) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const employeeResult:number = await EmployeeRepo.removeEmployeeById(employee)
    if ( employeeResult>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setAffectedRecords(employeeResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};
export const getEmployeeByEmployeeId = async (employee: IEmployee) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const employeeResult:IEmployee = await EmployeeRepo.getEmployeeByEmployeeId(employee.employee_id)
    if ( employeeResult!==null && Object.keys(employeeResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(employeeResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};