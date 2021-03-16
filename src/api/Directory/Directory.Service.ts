import { IDirectory, SubDirectoryInputModel, SubDirectoryOutputModel } from "./Directory.Model";
import * as DirectoryRepo from "./Directory.Repo";
import { ErrorResponse } from "../../helpers/ErrorResponse";
import { Result } from "../../helpers/Result";
import httpStatus from "http-status";
import { StatusCodes } from "../../helpers/StatusCodes";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { Environment } from "../../helpers/Environment";
import * as FileUtils from "../../utils/file-utils";
import { IFiles } from "../Files/Files.Model";
import { IRequestJson } from "../../helpers/RequestJson";
import * as UserRepo from "../User/User.Repo";
import { IUser } from "../User/User.Model";
import * as EmailUtils from "../../utils/email-utils";
import * as EmailTemplateRepo from "../EmailTemplate/EmailTemplate.Repo";
import getSize from 'get-folder-size';
import { promisify } from "util";
import { join, resolve } from "path";
import {PROD_PATH,DEV_PATH} from "../../helpers/Environment"
const PromisifyGetSize = promisify(getSize);


export const renameDirectory = async (directory: IDirectory) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: Array<IDirectory> = await DirectoryRepo.getAllDirectories(-1);
    if (directoryResult !== null) {
      directoryResult.forEach( async (directory) => {
        if(directory.is_directory){
          if(directory.entity_location){
              let folderLocation = directory.entity_location.split('/');
              folderLocation.splice(-1, 1);
              const newDirectoryLocation: string = folderLocation.join('/') + '/' + directory.entity_id;
              await FileUtils.renameDirectory(directory.entity_location, newDirectoryLocation);
              
            }
        }
      });
    }
    errorResponse.setErrorHttpStatus(httpStatus.OK);
    errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
    errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};


export const updateDirectoryLocation = async (directory: IDirectory) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: Array<IDirectory> = await DirectoryRepo.getAllDirectories(1);
    if (directoryResult !== null) {
      const ROOT_DIRECTORY: string = Environment.ROOT_FOLDER_DESTINATION as string;
      
      directoryResult.forEach( async (directory) => {
        if (!directory.parent_directory_id || directory.parent_directory_id == '' || directory.parent_directory_id == "") {
          
          const newName = directory.is_file ? directory.entity_name.trim() : directory.entity_id.trim(); 
          const newDirectoryLocation: string = join(ROOT_DIRECTORY, newName);
          
          const directoryResult1: IDirectory | any = await DirectoryRepo.updateDirectoryLocation(directory.entity_id, newDirectoryLocation);
          
        } else {
          const PARENT_DIRECTORY = await DirectoryRepo.getDirectoryLocationByDirectoryId(directory.parent_directory_id);
      
          const newName = directory.is_file ? directory.entity_name.trim() : directory.entity_id.trim(); 
          const newDirectoryLocation: string = join(
            PARENT_DIRECTORY.entity_location.trim(), newName
          );
          
          const directoryResult2: IDirectory | any = await DirectoryRepo.updateDirectoryLocation(directory.entity_id, newDirectoryLocation);

        }
      });
    }
    errorResponse.setErrorHttpStatus(httpStatus.OK);
    errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
    errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
    result.setErrorResponse(errorResponse);
    return result;
  } catch (error) {
    throw error;
  }
};


export const createDirectory = async (directory: IDirectory) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    directory.entity_id = "DR-" + new Date().getTime().toString();
    if (directory.parent_directory_id.trim().length < 1) {
      const ROOT_DIRECTORY: string = Environment.ROOT_FOLDER_DESTINATION as string;
      directory.entity_location = await FileUtils.makeDirectory(directory.entity_id, ROOT_DIRECTORY);
    } else {
      const PARENT_DIRECTORY = await DirectoryRepo.getDirectoryLocationByDirectoryId(directory.parent_directory_id);
      await DirectoryRepo.updateChildDirectoryArray(directory.parent_directory_id, directory.entity_id);
      directory.entity_location = await FileUtils.makeDirectory(directory.entity_id, PARENT_DIRECTORY.entity_location);
    }
    const directoryResult: IDirectory | any = await DirectoryRepo.createDirectory(directory);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setLastRecordId(directoryResult.entity_id);
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
export const createFile = async (directory: IDirectory, file: any) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  const FILE_NAME = file.originalname;
  const FILE_PATH = file.path;
  try {
    directory.entity_id = "FL-" + new Date().getTime().toString();
    const folderAsignedEmailTemplate = await EmailTemplateRepo.getEmailTemplate(2);
    if (directory.parent_directory_id.trim().length < 1) {
      const ROOT_DIRECTORY: string = Environment.ROOT_FOLDER_DESTINATION as string;
      directory.entity_location = await FileUtils.copyFileFromDestination(FILE_PATH, ROOT_DIRECTORY, FILE_NAME);
    } else {
      const parentDirectory: IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(directory.parent_directory_id);
      const PARENT_DIRECTORY = await DirectoryRepo.getDirectoryLocationByDirectoryId(directory.parent_directory_id);
      const PARENT_DIRECTORY_PATH = await FileUtils.getAbsoluteFolderLocation(PARENT_DIRECTORY.entity_location);
      await DirectoryRepo.updateChildFilesArray(directory.parent_directory_id, directory.entity_id);
      directory.entity_location = await FileUtils.copyFileFromDestination(FILE_PATH, PARENT_DIRECTORY_PATH, FILE_NAME);
      for (let user_id of parentDirectory.asigned_user_ids) {
        let user: IUser = await UserRepo.getUserByUserId(user_id);
        const emailString:string = folderAsignedEmailTemplate.email_template_body.replace("ASSIGNED_FOLDER_NAME",PARENT_DIRECTORY.entity_name);
        EmailUtils.sendMail(user.user_email, "New File has been Uploaded to your Smart-Doc account", emailString, "");
      }
    }
    await FileUtils.removeFile(FILE_PATH);
    directory.entity_name = FILE_NAME;
    directory.file_extension = (await FileUtils.getFileType(FILE_PATH)).substr(1);
    const directoryResult: IDirectory | any = await DirectoryRepo.createFile(directory);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setLastRecordId(directoryResult.entity_id);
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
export const getAllSubDirectoryByParentDirectoryId = async (directory: SubDirectoryInputModel) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  let child_directory: Array<IDirectory> = [];
  try {
    // const directoryResult:IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(directoryId);
    // if(directoryResult.child_directory_ids.length>0){
    //   for(let directoryId of directoryResult.child_directory_ids){
    //     child_directory.push(await DirectoryRepo.getDirectoryByDirectoryId(directoryId));
    //   }
    // }
    // directoryResult['child_directory']=child_directory;'
    const directoryResult: SubDirectoryOutputModel = await DirectoryRepo.getAllSubDirectories(directory); 

    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult.directoryResult);
      result.setTotalCount(directoryResult.totalCount);
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
export const getAllDirectoryByOwnerId = async (directory: IDirectory) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  let child_directory: Array<IDirectory> = [];
  try {
    // const directoryResult:IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(directoryId);
    // if(directoryResult.child_directory_ids.length>0){
    //   for(let directoryId of directoryResult.child_directory_ids){
    //     child_directory.push(await DirectoryRepo.getDirectoryByDirectoryId(directoryId));
    //   }
    // }
    // directoryResult['child_directory']=child_directory;'
    const directoryResult: Array<IDirectory> = await DirectoryRepo.getAllSubDirectoryByParentDirectoryId(directory.entity_id);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const removeDirectory = async (directory: IDirectory) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  let fileResult = {};
  try {
    const directoryResult: IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(directory.entity_id);
    if (directory.is_file) {
      fileResult = await DirectoryRepo.removeFromChildFilesArray(directoryResult.parent_directory_id, directory.entity_id);
    } else {
      fileResult = await DirectoryRepo.removeFromChildDirectoryArray(directoryResult.parent_directory_id, directory.entity_id);
    }
    await FileUtils.removeFile(directoryResult.entity_location);
    if (fileResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
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
export const addDirectorySharedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: IDirectory = await DirectoryRepo.addDirectorySharedUser(requestJson.entity_id, requestJson.user_ids)
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const removeDirectorySharedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: IDirectory = await DirectoryRepo.removeDirectorySharedUser(requestJson.entity_id, requestJson.user_id);
    if (directoryResult !== null && Object.keys(directoryResult).length > 0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const removeDirectoryAsignedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: IDirectory = await DirectoryRepo.removeDirectoryAsignedUser(requestJson.entity_id, requestJson.user_id);
    if (directoryResult !== null && Object.keys(directoryResult).length > 0) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const addDirectoryAsignedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: IDirectory = await DirectoryRepo.addDirectoryAsignedUser(requestJson.entity_id, requestJson.user_ids);
    const folderAsignedEmailTemplate = await EmailTemplateRepo.getEmailTemplate(2);
    for (let user_id of requestJson.user_ids) {
      let user: IUser = await UserRepo.getUserByUserId(user_id);
      //EmailUtils.sendMail(user.user_email,"Folder Assigned",folderAsignedEmailTemplate.email_template_body,"");
    }
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const getAllDirectoryByAsignedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: Array<IDirectory> = await DirectoryRepo.getAllDirectoryByAsignedUser(requestJson.user_id);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const getAllDirectoryBySharedUser = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: Array<IDirectory> = await DirectoryRepo.getAllDirectoryBySharedUser(requestJson.user_id);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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
export const deleteDirectory = async (requestJson: IRequestJson) => {
  let errorResponse = new ErrorResponse("");
  let result = new Result();
  try {
    const directoryResult: IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(requestJson.entity_id);
    if (directoryResult.parent_directory_id !== "" && directoryResult.is_directory == true) {
      await DirectoryRepo.removeFromChildDirectoryArray(directoryResult.parent_directory_id, requestJson.entity_id);
    }
    if (directoryResult.parent_directory_id !== "" && directoryResult.is_file == true) {
      await DirectoryRepo.removeFromChildFilesArray(directoryResult.parent_directory_id, requestJson.entity_id);
    }
    await deleteDirectoryRecursion(requestJson.entity_id);
    await FileUtils.removeFile(directoryResult.entity_location);
    if (directoryResult !== null) {
      errorResponse.setErrorHttpStatus(httpStatus.OK);
      errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
      errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
      result.setResponse(directoryResult);
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

//WARN:Database Related Recursion Method To Delete All Child Directory & Files From Parent Directory 
const deleteDirectoryRecursion = async (directoryId: string) => {
  try {
    const directoryResult: IDirectory = await DirectoryRepo.getDirectoryByDirectoryId(directoryId);
    if (directoryResult.child_directory_ids.length > 0) {
      for (let childDirectory of directoryResult.child_directory_ids) {
        await deleteDirectoryRecursion(childDirectory);
      }
    }
    if (directoryResult.child_files_ids.length > 0) {
      for (let childFile of directoryResult.child_files_ids) {
        await DirectoryRepo.removeDirectoryById(childFile);
      }
    }
    await DirectoryRepo.removeDirectoryById(directoryId);
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export const getDirectoryInfo = async (directoryName: string) => {
  const combinedFolderPath = resolve(process.cwd(), `${PROD_PATH}/files`, directoryName);
  let errorResponse = new ErrorResponse("");
  let result = new Result();

  try {
    const totalFolderSize = await PromisifyGetSize(combinedFolderPath)

    errorResponse.setErrorHttpStatus(httpStatus.OK);
    errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
    errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
    result.setErrorResponse(errorResponse);
    result.setResponse({ folderSize: totalFolderSize });
    return result;

  } catch (error) {
    const errorMessage = `no such file or directory like ${directoryName}`;
    errorResponse.setErrorHttpStatus(httpStatus.OK);
    errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
    errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
    errorResponse.setErrorMessage(errorMessage);
    result.setErrorResponse(errorResponse);
    result.setResponse(null);
    return result;
  }
}

