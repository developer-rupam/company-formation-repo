import {Router} from 'express';
import * as EmailTemplateController from './EmailTemplate.Controller';


const emailTemplateRouter=Router();


emailTemplateRouter.post('/upsert_email_template',EmailTemplateController.upsertEmailTemplate);
emailTemplateRouter.post('/get_email_template',EmailTemplateController.getEmailTemplate);



export {emailTemplateRouter}