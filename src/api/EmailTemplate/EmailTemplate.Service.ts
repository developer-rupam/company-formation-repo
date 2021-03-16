import httpStatus from "http-status";
import { ErrorResponse } from "../../helpers/ErrorResponse";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { Result } from "../../helpers/Result";
import { StatusCodes } from "../../helpers/StatusCodes";
import { IEmailTemplate } from "./EmailTemplate.Model";
import * as EmailTemplateRepo from "./EmailTemplate.Repo"

export const upsertEmailTemplate = async (emailTemplate: IEmailTemplate) => {
    let errorResponse = new ErrorResponse("");
    let result = new Result();
    try {
      const localEmailTemplate:IEmailTemplate=await EmailTemplateRepo.upsertEmailTemplate(emailTemplate.email_template_type,emailTemplate.email_template_body);
      if (localEmailTemplate !== null) {
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(localEmailTemplate);
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
  export const getEmailTemplate = async (emailTemplate: IEmailTemplate) => {
    let errorResponse = new ErrorResponse("");
    let result = new Result();
    try {
      const localEmailTemplate:IEmailTemplate=await EmailTemplateRepo.getEmailTemplate(emailTemplate.email_template_type);
      if (localEmailTemplate !== null) {
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(localEmailTemplate);
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
  