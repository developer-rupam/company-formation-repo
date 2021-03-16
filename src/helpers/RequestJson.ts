import { IUser } from "../api/User/User.Model";

export interface IRequestJson{
    page_size:number;
    page_no:number;
    entity_id:string;
    user_id:string;
    user_ids:Array<string>
    entity_ids:Array<string>;

}