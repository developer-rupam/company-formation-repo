import * as DirectoryService from './Directory.Service'
import { Result } from "../../helpers/Result";
import { Request, Response, NextFunction } from "express";

export const renameDirectory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.renameDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDirectoryLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.updateDirectoryLocation(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createDirectory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.createDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const createFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.createFile(req.body, req.file);
    res.status(200).json(result);
  } catch (error) {

    next(error);
  }
};
export const getAllSubDirectoryByParentDirectoryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.getAllSubDirectoryByParentDirectoryId(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const removeFileOrDirectory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.removeDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addDirectoryAsignedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.addDirectoryAsignedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const getAllDirectoryByAsignedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.getAllDirectoryByAsignedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const getAllDirectoryBySharedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.getAllDirectoryBySharedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const addDirectorySharedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.addDirectorySharedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const removeDirectorySharedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.removeDirectorySharedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const removeDirectoryAsignedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.removeDirectoryAsignedUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteDirectory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.deleteDirectory(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const getDirectoryInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Result = await DirectoryService.getDirectoryInfo(req.body.directoryName);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};