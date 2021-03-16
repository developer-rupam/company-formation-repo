import * as UserService from "./User.Service";
import { Result } from "../../helpers/Result";
import { Request, Response, NextFunction } from "express";

export const createUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.createUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const userLogin = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.userLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getAllUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.getAllUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const updateUserById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.updateUserById(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const removeUserById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.removeUserById(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getUserByUserId = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.getUserByUserId(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const addUserFavouriteDirectory = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.addUserFavouriteDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const removeUserFavouriteDirectory = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.removeUserFavouriteDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getFavouriteDirectoriesByUserId = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.getFavouriteDirectoriesByUserId(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const sendEmailCredential = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.sendEmailCredential(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};