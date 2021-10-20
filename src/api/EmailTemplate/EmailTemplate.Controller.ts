import { Request,Response,NextFunction } from "express";
import { Result } from "../../helpers/Result";
import { authorizeToken } from "../Authentication/Token.Repo";
import * as EmailTemplateService from "./EmailTemplate.Service";

export const upsertEmailTemplate = async (req: Request,res: Response,next: NextFunction) => {
    try {
      const token = await authorizeToken(req.headers)
      if(token){
        const result: Result = await EmailTemplateService.upsertEmailTemplate(req.body);
        res.status(200).json(result);
      }else{
        const result = {
          status: 401,
          message: 'Token Expired / Token Mismatch'
        }
        res.status(401).json(result);
      }
    } catch (error) {
      next(error);
    }
  };
  export const getEmailTemplate = async (req: Request,res: Response,next: NextFunction) => {
    try {
      const token = await authorizeToken(req.headers)
      if(token){
        const result: Result = await EmailTemplateService.getEmailTemplate(req.body);
        res.status(200).json(result);
      }else{
        const result = {
          status: 401,
          message: 'Token Expired / Token Mismatch'
        }
        res.status(401).json(result);
      }
    } catch (error) {
      next(error);
    }
  };