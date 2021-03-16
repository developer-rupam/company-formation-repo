import * as UserService from "./Employee.Service";
import { Result } from "../../helpers/Result";
import { Request, Response, NextFunction } from "express";

export const createEmployee = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.createEmployee(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getAllEmployees = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.getAllEmployees(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getEmployeeByEmployeeId = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.getEmployeeByEmployeeId(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const removeEmployeeById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.removeEmployeeById(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const updateEmployeeById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const result: Result = await UserService.updateEmployeeById(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

