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
import * as OtpRepo from "../Otp/Otp.Repo";
import { IOtp } from "../Otp/Otp.Model";
import { generateToken } from "../Authentication/Token.Repo";

export const createUser = async (users: Array<IUser>) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    let userIdArray:Array<string>=[];
    let userCreateEmailTemplate:IEmailTemplate=await EmailTemplateRepo.getEmailTemplate(1);
    let index = 0
    for (let user of users) {
      user.user_id = "US-" + new Date().getTime().toString() + index.toString();
      const userResult: IUser = await UserRepo.createUser(user);
      let emailString:string=userCreateEmailTemplate.email_template_body.replace("USER_EMAIL_IDENTIFIER",userResult.user_email).replace("USER_PASSWORD_IDENTIFIER",userResult.user_password);
      await EmailUtils.sendMail(user.user_email,"Welcome to Smart-Doc Account",emailString,"");
      userIdArray.push(userResult.user_id);
      index++
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
        const token = await generateToken();
        
        delete userResult.user_password;
        const userData:any = userResult;
        userData.token = token;
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(userData);
    }else if(employeeResult !== null  && employeeResult!==undefined && employeeResult.employee_password === user.user_password ){
        const token = await generateToken();
        
        delete employeeResult.employee_password;
        
        const userData:any = employeeResult;
        userData.token = token;

        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(userData);
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
export const getAllUser = async (requestJson: IRequestJson, excludeFields:any = null) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:Array<IUser> = await UserRepo.getAllUsers(requestJson, excludeFields); 
    if (userResult!== null && userResult.length>0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(userResult);
    } else {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
    }
    const totalCount = await UserRepo.getTotalUsers(requestJson);
    result.setTotalCount(totalCount);
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
    let emailString=userCreateEmailTemplate.email_template_body.replace("USER_EMAIL_IDENTIFIER",userResult.user_email).replace("USER_PASSWORD_IDENTIFIER",userResult.user_password);
    await EmailUtils.sendMail(userResult.user_email,"Your Smart-doc Account Login Details",emailString,"");
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

export const changePassword = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  if(user.user_email && user.user_password){
  try {
    const userResult:IOtp = await OtpRepo.getOtpRecord(user.user_email);
    if (!userResult || userResult === null || userResult===undefined){
        errorResponse.setErrorMessage('Either OTP has Expired or OTP not found, Please re-send OTP');
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.TOKEN_EXPIRED_ERROR);
        errorResponse.setErrorStatusType(ResponseTypes.FAILED);
        result.setErrorResponse(errorResponse);
        return result;
    }

    const userRec:IUser = await UserRepo.getUserByUserEmail(user.user_email);
    const employeeRec:IEmployee = await EmployeeRepo.getEmployeeByEmployeeEmail(user.user_email);
    if (userRec !== null && userRec!==undefined){
        userRec.user_password = user.user_password;
        const userResult:number = await UserRepo.updateUserById(userRec);
          if (userResult>0) {
            result.setResponse("Password changed successfully");
            errorResponse.setErrorHttpStatus(httpStatus.OK);
            errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
            errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
            result.setAffectedRecords(userResult);
          } else {
            errorResponse.setErrorMessage('Unable to change password, please try again');
            errorResponse.setErrorHttpStatus(httpStatus.OK);
            errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
            errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
          }
          result.setErrorResponse(errorResponse);
          return result;
      
    }else if(employeeRec !== null  && employeeRec!==undefined){
        employeeRec.employee_password = user.user_password;
        const userResult:number = await EmployeeRepo.updateEmployeeById(employeeRec);
          if (userResult>0) {
            result.setResponse("Password changed successfully");
            errorResponse.setErrorHttpStatus(httpStatus.OK);
            errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
            errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
            result.setAffectedRecords(userResult);
          } else {
            errorResponse.setErrorMessage('Unable to change password, please try again');
            errorResponse.setErrorHttpStatus(httpStatus.OK);
            errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
            errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
          }
          result.setErrorResponse(errorResponse);
          return result;

    } else {
      errorResponse.setErrorMessage('User not found');
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.FAILURE);
      errorResponse.setErrorStatusType(ResponseTypes.FAILED);
    }
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
 }else{
  errorResponse.setErrorMessage('Bad Request')
  errorResponse.setErrorHttpStatus(httpStatus.BAD_REQUEST);
  errorResponse.setErrorStatusCode(StatusCodes.FAILURE);
  errorResponse.setErrorStatusType(ResponseTypes.FAILED);
  result.setErrorResponse(errorResponse);
  return result;
 }
};
export const getUser = async (user: IUser) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const userResult:IUser = await UserRepo.getUser(user.user_id);
    if (userResult!==null) {
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