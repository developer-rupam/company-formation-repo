import * as UserService from "./User.Service";
import * as DirectoryService from '../Directory/Directory.Service'
import { Result } from "../../helpers/Result";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../helpers/ErrorResponse";
import httpStatus from "http-status";
import { StatusCodes } from "../../helpers/StatusCodes";
import { ResponseTypes } from "../../helpers/ResponseTypes";
import { authorizeToken } from "../Authentication/Token.Repo";

export const createUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.createUser(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const userLogin = async (req: Request,res: Response,next: NextFunction) => {
  try {
    console.log('userResult', req.body);
    const result: Result = await UserService.userLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getAllUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.getAllUser(req.body, {_id:0,__v:0, user_password:0});
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
    
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const updateUserById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.updateUserById(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const removeUserById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.removeUserById(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getUserByUserId = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.getUserByUserId(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const addUserFavouriteDirectory = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.addUserFavouriteDirectory(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const removeUserFavouriteDirectory = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.removeUserFavouriteDirectory(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getFavouriteDirectoriesByUserId = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.getFavouriteDirectoriesByUserId(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const sendEmailCredential = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.sendEmailCredential(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const changePassword = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.changePassword(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const result: Result = await UserService.getUser(req.body);
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const searchData = async (req: Request,res: Response,next: NextFunction) => {
  const errorResponse = new ErrorResponse("");
  const result = new Result();
  try {
    const token = await authorizeToken(req.headers)
    if(token){
      const response: any = {
        user: [],
        directory: []
      }
      const userResult: Result = await UserService.getAllUser(req.body, {__v:0, user_password:0});
      if(userResult.getTotalCount()){
        response.user = userResult.getResponse();
      }
      const input:any = {
        page: 0,
        limit: 90000000,
        searchQuery: req.body.searchQuery
      };
      const dirResult: Result = await DirectoryService.getAllSubDirectoryByParentDirectoryId(input, {__v:0});
      if(dirResult.getTotalCount()){
        response.directory = dirResult.getResponse();
      }
      if(userResult.getTotalCount() || dirResult.getTotalCount()){
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.SUCCESS);
        result.setResponse(response);
      }else{
        errorResponse.setErrorHttpStatus(httpStatus.OK);
        errorResponse.setErrorStatusCode(StatusCodes.SUCCESS);
        errorResponse.setErrorStatusType(ResponseTypes.NOT_FOUND);
      }
      result.setErrorResponse(errorResponse); 
      res.status(200).json(result);
    }else{
      const result = {
        status: 401,
        message: 'Token Expired / Token Mismatch'
      }
      res.status(401).json(result);
    }
  } catch (error) {
    console.log(error);

    next(error);
  }
};