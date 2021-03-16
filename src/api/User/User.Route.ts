import {Router} from 'express';
import * as UserController from './User.Controller'

const userRouter=Router();

userRouter.post('/create_user',UserController.createUser);
userRouter.post('/login_user',UserController.userLogin);
userRouter.post('/get_all_user',UserController.getAllUser);
userRouter.post('/update_user',UserController.updateUserById);
userRouter.post('/remove_user',UserController.removeUserById);
userRouter.post('/get_user_details',UserController.getUserByUserId);
userRouter.post('/get_favourite_directories_by_user',UserController.getFavouriteDirectoriesByUserId);
userRouter.post('/add_user_favourite_directory',UserController.addUserFavouriteDirectory);
userRouter.post('/remove_user_favourite_directory',UserController.removeUserFavouriteDirectory);
userRouter.post('/send_user_credential',UserController.sendEmailCredential);


export {userRouter};