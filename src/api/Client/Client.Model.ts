import {Schema} from 'mongoose'


export interface IClient{
    client_id:string;
    frist_name:string;
    last_name:string;
    email:string;
    password:string;
    company:string;
    last_login:string;
    client_status:string;
    client_created:string;
}
export interface IClientGroup{
    client_id:string;
    frist_name:string;
    last_name:string;
    email:string;
    password:string;
    company:string;
    last_login:string;
    client_status:string;
    client_created:string;
}


