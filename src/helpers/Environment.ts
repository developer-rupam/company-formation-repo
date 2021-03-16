import * as dotenv from 'dotenv';
import {resolve} from 'path';

export const PROD_PATH = ".."
export const DEV_PATH = "."

dotenv.config({path:resolve(process.cwd(),`${PROD_PATH}/.env`)})

export class Environment{
    public static ROOT_FOLDER_DESTINATION=process.env.ROOT_FOLDER_DESTINATION;
    public static APP_DEV_PORT=process.env.APP_DEV_PORT;
    public static MONGO_DEV_URI=process.env.MONGO_DEV_URI;
    public static MULTER_STORAGE_PATH=process.env.MULTER_STORAGE_PATH;
    
    

}