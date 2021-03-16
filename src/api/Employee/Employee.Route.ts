import {Router} from 'express';
import * as EmployeeController from './Employee.Controller'

const employeeRouter=Router();

employeeRouter.post('/create_employee',EmployeeController.createEmployee);
employeeRouter.post('/get_all_employee',EmployeeController.getAllEmployees);
employeeRouter.post('/get_employee_details',EmployeeController.getEmployeeByEmployeeId);
employeeRouter.post('/update_employee',EmployeeController.updateEmployeeById);
employeeRouter.post('/remove_employee',EmployeeController.removeEmployeeById);



export {employeeRouter};