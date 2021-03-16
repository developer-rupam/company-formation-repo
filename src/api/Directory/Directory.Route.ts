import { Router } from 'express';
import * as DirectoryController from './Directory.Controller';
import { singleUpload } from '../../middlewares/file-handler/multer-fileHandler'
const directoryRouter = Router();


directoryRouter.post('/create_directory', DirectoryController.createDirectory);
directoryRouter.post('/create_file', singleUpload, DirectoryController.createFile);
directoryRouter.post('/get_all_sub_directory', DirectoryController.getAllSubDirectoryByParentDirectoryId);
directoryRouter.post('/add_directory_asigned_user', DirectoryController.addDirectoryAsignedUser);
directoryRouter.post('/get_directory_by_asigned_user', DirectoryController.getAllDirectoryByAsignedUser);
directoryRouter.post('/remove_directory_asigned_user', DirectoryController.removeDirectoryAsignedUser);
directoryRouter.post('/remove_directory_shared_user', DirectoryController.removeDirectorySharedUser);
directoryRouter.post('/add_directory_shared_user', DirectoryController.addDirectorySharedUser);
directoryRouter.post('/remove_directory', DirectoryController.deleteDirectory);
directoryRouter.post('/get_directory_by_shared_user', DirectoryController.getAllDirectoryBySharedUser);
directoryRouter.post('/get_directory/', DirectoryController.getDirectoryInfo);
directoryRouter.post('/rename_directory', DirectoryController.renameDirectory);
directoryRouter.post('/update_directory_location', DirectoryController.updateDirectoryLocation);

directoryRouter.get('/ping', (req,res,next)=>{
    res.status(200).send("Pong");
});


export { directoryRouter }