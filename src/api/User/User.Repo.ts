import { IRequestJson } from "../../helpers/RequestJson";
import { IUser, UserModel } from "./User.Model";

export const createUser = async (user: IUser): Promise<IUser> => {
  try {
    const doc = await UserModel.create({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_company: user.user_company,
      user_password: user.user_password,
      user_type: user.user_type,
      user_role:user.user_role,
      created_by:user.created_by,
      change_password:user.change_password,
      access_user_settings:user.access_user_settings
    });
    const userResult: IUser = await doc.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const getUserByUserId = async (userId: string): Promise<IUser> => {
  try {
    const doc = await UserModel.findOne(
      {
        user_id: userId,
      },
      { _id: 0, __v: 0, user_password:0 }
    );
    const userResult: IUser = doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const getUserByUserEmail = async (userEmail: string): Promise<IUser> => {
  try {
    const doc = await UserModel.findOne(
      {
        user_email: userEmail,
      },
      { _id: 0, __v: 0 }
    );
    const userResult: IUser = doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const getAllUsers = async (params: IRequestJson, excludeFields:any = null): Promise<Array<IUser>> => {
    let filter:any = {};
    if(params.searchQuery && params.searchQuery.trim().length){
      filter = { $or:  [ 
                            {user_name: {$regex: new RegExp(params.searchQuery.trim(), "i")}},
                            {user_email: {$regex: new RegExp(params.searchQuery.trim(), "i")}},
                            {user_company: {$regex: new RegExp(params.searchQuery.trim(), "i")}}
                        ]
                } 
    }
    const SKIP:number=(params.page_no-1)*params.page_size;
    const LIMIT:number=params.page_size;
    try {
      const doc = await UserModel.find(filter, excludeFields ?? {_id:0,__v:0})
                                .skip(SKIP)
                                .limit(LIMIT)
                                .sort({user_created: params.sort ? params.sort : -1 });
      const userResult: Array<IUser> = doc.map((singleDoc) => singleDoc.toObject());
      return userResult;
    } catch (error) {
      throw error;
    }
};
export const getTotalUsers = async (params: IRequestJson)  =>{
  let filter:any = {};
  if(params.searchQuery && params.searchQuery.trim().length){
    filter = { $or:  [ 
                          {user_name: {$regex: new RegExp(params.searchQuery.trim(), "i")}},
                          {user_email: {$regex: new RegExp(params.searchQuery.trim(), "i")}},
                          {user_company: {$regex: new RegExp(params.searchQuery.trim(), "i")}}
                      ]
              }; 
  }
  try {
    const totalCount:any = await UserModel.count(filter);
    return totalCount; 
  } catch(error){
    throw error;
  }
}
export const updateUserById = async (user: IUser): Promise<number> => {
  try {
    const setData:any = {
      user_name: user.user_name,
      user_email: user.user_email,
      user_company: user.user_company,
      user_type: user.user_type,
      user_role:user.user_role,
      created_by:user.created_by,
      change_password:user.change_password,
      access_user_settings:user.access_user_settings
    };
    if(user.user_password && user.user_password.trim()){
      setData.user_password = user.user_password.trim();
    }

    const doc= await UserModel.updateOne({ user_id: user.user_id,},{$set: setData},{ upsert:false });
    const userResult =  doc.nModified;
    console.log("ModifiedCount")
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const removeUserById = async (user: IUser): Promise<number> => {
  try {
    const doc= await UserModel.remove({ user_id: user.user_id,});
    const userResult =  doc.deletedCount as number;
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const addUserFavouriteDirectory = async (userId:string,entityIds:Array<string>): Promise<IUser> => {
  try {
    const doc= await UserModel.findOneAndUpdate({
      user_id: userId
    },{$addToSet: { favourite_entity_ids: {$each:entityIds}}},{new:true});
    const userResult:IUser =  await doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const removeUserFavouriteDirectory = async (userId:string,entityId:string): Promise<IUser> => {
  try {
    const doc= await UserModel.findOneAndUpdate({
      user_id: userId
    },{$pull: { favourite_entity_ids: entityId}},{new:true});
    const userResult:IUser =  await doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};
export const getUser = async (userId: string): Promise<IUser> => {
  try {
    const doc = await UserModel.findOne(
      {
        user_id: userId,
      },
      { _id: 0, __v: 0, user_password: 0 }
    );
    const userResult: IUser = doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};


