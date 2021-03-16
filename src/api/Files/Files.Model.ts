export interface IFiles{
    file_id:string;
    file_name:string;
    file_type:string;
    file_extension:string;
    file_size:string;
    file_location:string;
    file_creater:string;
    file_status:number;
    file_created:string;
    can_download:Array<string>;
    can_view:Array<string>;
    can_delete:Array<string>;
}

export interface IFileUser{
    user_id:string;
    can_download:boolean;
    can_view:boolean;
    can_delete:boolean;
}