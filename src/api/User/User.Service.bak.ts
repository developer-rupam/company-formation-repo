import { ErrorResponse } from "../../helpers/ErrorResponse";
import { Result } from "../../helpers/Result";
import * as UserRepo from "./User.Repo";
import { IUser } from "./User.Model";
import httpStatus from "http-status";
import { StatusCodes } from "../../helpers/StatusCodes";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { IRequestJson } from "../../helpers/RequestJson";
import * as EmployeeRepo from "../Employee/Employee.Repo";
import * as DirectoryRepo from "../Directory/Directory.Repo";
import { IEmployee } from "../Employee/Employee.Model";
import * as EmailUtils from "../../utils/email-utils"
import * as EmailTemplateRepo from "../EmailTemplate/EmailTemplate.Repo";
import { IEmailTemplate } from "../EmailTemplate/EmailTemplate.Model";
import { IDirectory } from "../Directory/Directory.Model";

export const createUser = async (users: Array<IUser>) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    let userIdArray:Array<string>=[];
    let userCreateEmailTemplate:IEmailTemplate=await EmailTemplateRepo.getEmailTemplate(1);
    for (let user of users) {
      user.user_id = "US-" + new Date().getTime().toString();
      const userResult: IUser = await UserRepo.createUser(user);
      await EmailUtils.sendMail(user.user_email,"User Creation",userCreateEmailTemplate.email_template_body,"");
      userIdArray.push(userResult.user_id);
    }
    if (userIdArray.length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result['lastInsertedIds']=userIdArray;
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
export const userLogin = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:IUser = await UserRepo.getUserByUserEmail(user.user_email);
    const employeeResult:IEmployee = await EmployeeRepo.getEmployeeByEmployeeEmail(user.user_email);
    if (userResult !== null && userResult!==undefined && userResult.user_password === user.user_password){
          delete userResult.user_password;
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(userResult);
      
    }else if(employeeResult !== null  && employeeResult!==undefined && employeeResult.employee_password === user.user_password ){
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
export const getAllUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:Array<IUser> = await UserRepo.getAllUsers(requestJson.page_no,requestJson.page_size); 
    if (userResult!== null && userResult.length>1) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
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
export const updateUserById = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:number = await UserRepo.updateUserById(user);
    if (userResult>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setAffectedRecords(userResult);
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
export const removeUserById = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:number = await UserRepo.removeUserById(user);
    if (userResult>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setAffectedRecords(userResult);
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
export const getUserByUserId = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:IUser = await UserRepo.getUserByUserId(user.user_id);
    if (userResult!==null && Object.keys(userResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
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
export const addUserFavouriteDirectory= async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:IUser = await UserRepo.addUserFavouriteDirectory(requestJson.user_id,requestJson.entity_ids);
    if (userResult!==null && Object.keys(userResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
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
export const removeUserFavouriteDirectory= async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:IUser = await UserRepo.removeUserFavouriteDirectory(requestJson.user_id,requestJson.entity_id);
    if (userResult!==null && Object.keys(userResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
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
export const getFavouriteDirectoriesByUserId = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    let directoryArray:Array<IDirectory>=[];
    let userResult:IUser = await UserRepo.getUserByUserId(user.user_id);
    for(let directoryId of userResult.favourite_entity_ids){
      directoryArray.push(await DirectoryRepo.getDirectoryByDirectoryId(directoryId));
    }
    userResult['favourite_entity']=directoryArray;
    if (userResult!==null && Object.keys(userResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
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
export const sendEmailCredential = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    let userCreateEmailTemplate:IEmailTemplate=await EmailTemplateRepo.getEmailTemplate(3);
    let userResult:IUser = await UserRepo.getUserByUserId(user.user_id);
    let emailString=`<br><p> Your Email : ${userResult.user_email} And Password : ${userResult.user_password} </p>`;
    await EmailUtils.sendMail(userResult.user_email,"User Credential",userCreateEmailTemplate.email_template_body.concat(emailString),"");
    if (userResult!==null && Object.keys(userResult).length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
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