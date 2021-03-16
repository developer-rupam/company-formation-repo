import { EmailTemplateModel, IEmailTemplate } from "./EmailTemplate.Model";


export const upsertEmailTemplate = async (emailTemplateType: number,emailTemplateBody: string): Promise<IEmailTemplate> => {
    try {
      const doc = await EmailTemplateModel.findOneAndUpdate(
        {
            email_template_type: emailTemplateType,
        },
        { email_template_body: emailTemplateBody  },
        { new: true,upsert:true }
      );
      const emailTemplate: IEmailTemplate = await doc?.toObject();
      return emailTemplate;
    } catch (error) {
      throw error;
    }
  };
  export const getEmailTemplate = async (emailTemplateType: number): Promise<IEmailTemplate> => {
    try {
      const doc = await EmailTemplateModel.findOne(
        {
            email_template_type: emailTemplateType,
        }
      );
      const emailTemplate: IEmailTemplate = await doc?.toObject();
      return emailTemplate;
    } catch (error) {
      throw error;
    }
  };