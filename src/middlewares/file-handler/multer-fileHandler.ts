import multer,{} from 'multer';
import { Environment } from '../../helpers/Environment';

const multerStorage=Environment.MULTER_STORAGE_PATH as string;

const storage=multer.diskStorage({
destination:(req,file,callback)=> {
    callback(null,multerStorage);
},
filename:(req,file,callback)=>{
    callback(null,file.originalname);
}
});

export const singleUpload=multer({storage:storage}).single('file');