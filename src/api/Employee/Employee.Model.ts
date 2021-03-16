import { Schema, model, Types } from "mongoose";

export interface IEmployee {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_password: string;
  employee_company: string;
  user_type: string;
  user_role:string;
  created_by:string;
  employee_status: number;
  employee_created: string;
  employee_updated: string;
  access_employee_settings: boolean;
  change_password: boolean;
  access_company_account_setting: boolean;
  create_root_level_folder: boolean;
  use_personal_file_box: boolean;
  access_others_file_box: boolean;
  manage_client: boolean;
  manage_employee: boolean;
  access_company_account: boolean;
  edit_shared_address_book: boolean;
  share_distribution_groups: boolean;
  edit_other_distribution_groups: boolean;
  manage_super_user_group: boolean;
  edit_account_preference: boolean;
  access_reporting: boolean;
  view_notification_history: boolean;
  configure_single_sign_on: boolean;
  view_edit_billing_information: boolean;
  request_plan_changes: boolean;
  view_receipt_billing_notification: boolean;
  create_manage_connectors: boolean;
  create_sharepoint_connectors: boolean;
  create_network_share_connectors: boolean;
  manage_folder_template: boolean;
  manage_remote_upload_form: boolean;
  manage_file_drop: boolean;
  
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employee_id: { type: Schema.Types.String, trim: true, unique: true },
    employee_name: { type: Schema.Types.String },
    employee_email: { type: Schema.Types.String, trim: true, unique: true },
    employee_company: { type: Schema.Types.String, trim: true, default: "" },
    employee_password: { type: Schema.Types.String, trim: true },
    employee_status: { type: Schema.Types.Number, trim: true, default: 1 },
    user_type: { type: Schema.Types.String, trim: true, default: "EMPLOYEE" },
    user_role:{ type: Schema.Types.String, trim: true },
    created_by:{ type: Schema.Types.String, trim: true },
    access_employee_settings: { type: Schema.Types.Boolean, default: false },
    change_password: { type: Schema.Types.Boolean, default: false },
    access_company_account_setting: {
      type: Schema.Types.Boolean,
      default: false,
    },
    create_root_level_folder: { type: Schema.Types.Boolean, default: false },
    use_personal_file_box: { type: Schema.Types.Boolean, default: false },
    access_others_file_box: { type: Schema.Types.Boolean, default: false },
    manage_client: { type: Schema.Types.Boolean, default: false },
    manage_employee: { type: Schema.Types.Boolean, default: false },
    access_company_account: { type: Schema.Types.Boolean, default: false },
    edit_shared_address_book: { type: Schema.Types.Boolean, default: false },
    share_distribution_groups: { type: Schema.Types.Boolean, default: false },
    edit_other_distribution_groups: {
      type: Schema.Types.Boolean,
      default: false,
    },
    manage_super_user_group: { type: Schema.Types.Boolean, default: false },
    edit_account_preference: { type: Schema.Types.Boolean, default: false },
    access_reporting: { type: Schema.Types.Boolean, default: false },
    view_notification_history: { type: Schema.Types.Boolean, default: false },
    configure_single_sign_on: { type: Schema.Types.Boolean, default: false },
    view_edit_billing_information: {
      type: Schema.Types.Boolean,
      default: false,
    },
    request_plan_changes: { type: Schema.Types.Boolean, default: false },
    view_receipt_billing_notification: {
      type: Schema.Types.Boolean,
      default: false,
    },
    create_manage_connectors: { type: Schema.Types.Boolean, default: false },
    create_sharepoint_connectors: {
      type: Schema.Types.Boolean,
      default: false,
    },
    create_network_share_connectors: {
      type: Schema.Types.Boolean,
      default: false,
    },
    manage_folder_template: { type: Schema.Types.Boolean, default: false },
    manage_remote_upload_form: { type: Schema.Types.Boolean, default: false },
    manage_file_drop: { type: Schema.Types.Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "employee_created",
      updatedAt: "employee_updated",
    },
  }
);

export const EmployeeModel = model("employees", EmployeeSchema);
