import { IEmployee, EmployeeModel } from "./Employee.Model";
import { Document, DocumentQuery } from "mongoose";

export const createEmployee = async (employee: IEmployee): Promise<IEmployee> => {
  try {
    const doc = await EmployeeModel.create({
      employee_id: employee.employee_id,
      employee_name: employee.employee_name,
      employee_email: employee.employee_email,
      employee_company: employee.employee_company,
      employee_password: employee.employee_password,
      user_type: employee.user_type,
      user_role:employee.user_role,
      created_by:employee.created_by,
      change_password:employee.change_password,
      access_employee_settings:employee.access_employee_settings,
      access_company_account_setting: employee.access_company_account_setting,
      create_root_level_folder: employee.create_root_level_folder,
      use_personal_file_box: employee.use_personal_file_box,
      access_others_file_box: employee.access_others_file_box,
      manage_client: employee.manage_client,
      manage_employee: employee.manage_employee,
      access_company_account: employee.access_company_account,
      edit_shared_address_book: employee.edit_shared_address_book,
      share_distribution_groups: employee.share_distribution_groups,
      edit_other_distribution_groups: employee.edit_other_distribution_groups,
      manage_super_user_group: employee.manage_super_user_group,
      edit_account_preference: employee.edit_account_preference,
      access_reporting: employee.access_reporting,
      view_notification_history: employee.view_notification_history,
      configure_single_sign_on: employee.configure_single_sign_on,
      view_edit_billing_information: employee.view_edit_billing_information,
      request_plan_changes: employee.request_plan_changes,
      view_receipt_billing_notification: employee.view_receipt_billing_notification,
      create_manage_connectors: employee.create_manage_connectors,
      create_sharepoint_connectors: employee.create_sharepoint_connectors,
      create_network_share_connectors: employee.create_network_share_connectors,
      manage_folder_template: employee.manage_folder_template,
      manage_remote_upload_form: employee.manage_remote_upload_form,
      manage_file_drop: employee.manage_file_drop,
    });
    const emloyeeResult: IEmployee = await doc.toObject();
    return emloyeeResult;
  } catch (error) {
    throw error;
  }
};
export const getEmployeeByEmployeeId = async (employeeId: string): Promise<IEmployee> => {
  try {
    const doc = await EmployeeModel.findOne(
      {
        employee_id: employeeId,
      },
      { _id: 0, __v: 0, employee_password: 0 }
    );
    const emloyeeResult: IEmployee = doc?.toObject();
    return emloyeeResult;
  } catch (error) {
    throw error;
  }
};
export const getEmployeeByEmployeeEmail = async (employeeEmail: string): Promise<IEmployee> => {
  try {
    const doc = await EmployeeModel.findOne(
      {
        employee_email: employeeEmail,
      },
      { _id: 0, __v: 0 }
    );
    const emloyeeResult: IEmployee = doc?.toObject();
    return emloyeeResult;
  } catch (error) {
    throw error;
  }
};
export const getAllEmployees = async (pageNo:number,pageSize:number): Promise<Array<IEmployee>> => {
  try {
    const SKIP:number=(pageNo-1)*pageSize;
    const LIMIT:number=pageSize;
    const doc = await EmployeeModel.find({},{_id:0,__v:0, employee_password:0}).skip(SKIP).limit(LIMIT);
    const emloyeeResult: Array<IEmployee> = doc.map((singleDoc) => singleDoc.toObject());
    return emloyeeResult;
  } catch (error) {
    throw error;
  }
};
export const updateEmployeeById = async (employee: IEmployee): Promise<number> => {
  try {
    const setData: any = {
      employee_name: employee.employee_name,
      employee_email: employee.employee_email,
      employee_company: employee.employee_company,
      employee_password: employee.employee_password,
      user_type: employee.user_type,
      user_role:employee.user_role,
      created_by:employee.created_by,
      change_password:employee.change_password,
      access_employee_settings:employee.access_employee_settings,
      access_company_account_setting: employee.access_company_account_setting,
      create_root_level_folder: employee.create_root_level_folder,
      use_personal_file_box: employee.use_personal_file_box,
      access_others_file_box: employee.access_others_file_box,
      manage_client: employee.manage_client,
      manage_employee: employee.manage_employee,
      access_company_account: employee.access_company_account,
      edit_shared_address_book: employee.edit_shared_address_book,
      share_distribution_groups: employee.share_distribution_groups,
      edit_other_distribution_groups: employee.edit_other_distribution_groups,
      manage_super_user_group: employee.manage_super_user_group,
      edit_account_preference: employee.edit_account_preference,
      access_reporting: employee.access_reporting,
      view_notification_history: employee.view_notification_history,
      configure_single_sign_on: employee.configure_single_sign_on,
      view_edit_billing_information: employee.view_edit_billing_information,
      request_plan_changes: employee.request_plan_changes,
      view_receipt_billing_notification: employee.view_receipt_billing_notification,
      create_manage_connectors: employee.create_manage_connectors,
      create_sharepoint_connectors: employee.create_sharepoint_connectors,
      create_network_share_connectors: employee.create_network_share_connectors,
      manage_folder_template: employee.manage_folder_template,
      manage_remote_upload_form: employee.manage_remote_upload_form,
      manage_file_drop: employee.manage_file_drop,
    };
    if(employee.employee_password && employee.employee_password.trim()){
      setData.employee_password = employee.employee_password.trim();
    }

    const doc= await EmployeeModel.updateOne({ employee_id: employee.employee_id},{$set: setData},{ upsert:false });
    const emloyeeResult =  doc.nModified;
    return emloyeeResult;
  } catch (error) {
    throw error;
  }
};
export const removeEmployeeById = async (employee: IEmployee): Promise<number> => {
  try {
    const doc= await EmployeeModel.remove({ employee_id: employee.employee_id,});
    const employeeResult =  doc.deletedCount as number;
    return employeeResult;
  } catch (error) {
    throw error;
  }
};
