import { Request,Response,NextFunction } from "express";
import { Result } from "../../helpers/Result";
import * as EmailTemplateService from "./EmailTemplate.Service";

export const upsertEmailTemplate = async (req: Request,res: Response,next: NextFunction) => {
    try {
      const result: Result = await EmailTemplateService.upsertEmailTemplate(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  export const getEmailTemplate = async (req: Request,res: Response,next: NextFunction) => {
    try {
      const result: Result = await EmailTemplateService.getEmailTemplate(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };