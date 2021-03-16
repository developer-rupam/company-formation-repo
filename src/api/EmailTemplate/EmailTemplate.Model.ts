import { Schema, model, Types } from "mongoose";

export interface IEmailTemplate {
 email_template_type:number;
 email_template_body:string;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    email_template_type: { type: Schema.Types.String, trim: true, unique: true },
    email_template_body: { type: Schema.Types.String },
  },
  {
    timestamps: {
      createdAt: "email_template_created",
      updatedAt: "email_template_updated",
    },
  }
);

export const EmailTemplateModel = model("emailTemplates", EmailTemplateSchema);
