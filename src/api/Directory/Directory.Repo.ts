import { IRequestJson } from "../../helpers/RequestJson";
import { Directory, IDirectory, IParentDirectory, SubDirectoryFilterModel, SubDirectoryInputModel, SubDirectoryOutputModel } from "./Directory.Model";

export const createDirectory = async (directory: IDirectory): Promise<IDirectory> => {
  try {
    const doc = await Directory.create({
      entity_id: directory.entity_id,
      entity_name: directory.entity_name,
      parent_directory_id: directory.parent_directory_id,
      directory_owner: directory.directory_owner,
      entity_location: directory.entity_location,
      is_directory:true,
      is_file:false 
    });
    const directoryResult: IDirectory = await doc.toObject();
    return directoryResult;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
};

export const updateDirectoryLocation = async (
  entityId: string,
  entityLocation: string
): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate(
      {
        entity_id: entityId,
      },
      { entity_location: entityLocation },
      { new: false }
    );
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};

export const getAllDirectories = async (sortOrder: number, params:any = null): Promise<Array<IDirectory>> => {
  const limit = params.limit ? params.limit : 1000;
  try {
    const doc = await Directory.find({},{_id:0,__v:0})
    .skip(params.page ? limit * params.page : 0)
    .limit(limit)
    .sort({_id: sortOrder});
    let directoryResult: Array<IDirectory> =doc.map((singleDoc) => singleDoc.toObject());
    return directoryResult;
  } catch (error) {
    throw error;
  }
};

export const getAllDirectoryListByOwnerId = async (directory: IDirectory): Promise<Array<IDirectory>> => {
  try {
    const doc = await Directory.find(
      {
        directory_owner: directory.directory_owner,
      },
      { _id: 0, __v: 0 }
    ).lean();
    console.log(doc);

    const directoryResult: Array<IDirectory> | any = doc;
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const getDirectoryLocationByDirectoryId = async (entityId: string): Promise<IParentDirectory> => {
  try {
    const doc = await Directory.findOne(
      {
        entity_id: entityId,
      },
      { entity_location: 1, entity_name: 1 }
    );
    const directoryResult: IDirectory = doc?.toObject();
    return {
             entity_location: directoryResult.entity_location,
             entity_name: directoryResult.entity_name
           };
  } catch (error) {
    throw error;
  }
};
export const updateChildDirectoryArray = async (
  parentDirectoryId: string,
  entityId: string
): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate(
      {
        entity_id: parentDirectoryId,
      },
      { $push: { child_directory_ids: entityId } },
      { new: false }
    );
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const removeFromChildDirectoryArray = async (parentDirectoryId: string,entityId: string): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate(
      {
        entity_id: parentDirectoryId,
      },
      { $pull: { child_directory_ids: entityId } },
      { new: false }
    );
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const updateChildFilesArray = async (parentDirectoryId: string,entityId: string): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate(
      {
        entity_id: parentDirectoryId,
      },
      { $push: { child_files_ids: entityId } },
      { new: false }
    );
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const removeFromChildFilesArray = async (parentDirectoryId: string,entityId: string): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate(
      {
        entity_id: parentDirectoryId,
      },
      { $pull: { child_files_ids: entityId } },
      { new: false }
    );
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const getDirectoryByDirectoryId = async (
  entityId: string
): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOne({
      entity_id: entityId,
    });
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const getAllSubDirectoryByParentDirectoryId = async (
  entityId: string
): Promise<Array<IDirectory>> => {
  try {
    const doc = await Directory.find({
      parent_directory_id: entityId,
    },{_id:0,__v:0});
    const directoryResult: Array<IDirectory> = doc.map((singleDoc) => singleDoc.toObject());
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const createFile = async (directory: IDirectory): Promise<IDirectory> => {
  try {
    const doc = await Directory.create({
      entity_id: directory.entity_id,
      entity_name: directory.entity_name,
      parent_directory_id: directory.parent_directory_id,
      directory_owner: directory.directory_owner,
      entity_location: directory.entity_location,
      file_extension:directory.file_extension,
      file_type:directory.file_type,
      is_directory:false,
      is_file:true 
    });
    const directoryResult: IDirectory = await doc.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const addDirectorySharedUser = async (entityId: string,userIds:Array<string>): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate({
      entity_id: entityId
    },{$addToSet: { shared_user_ids: {$each:userIds}}},{new:false});
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};

export const removeDirectorySharedUser = async (entityId: string,userId:string): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate({
      entity_id: entityId
    },{$pull: { shared_user_ids: userId}},{new:false});
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const addDirectoryAsignedUser = async (entityId: string,userIds:Array<string>): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate({
      entity_id: entityId
    },{$addToSet: { asigned_user_ids: {$each:userIds}}},{new:false});
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const getAllDirectoryByAsignedUser = async (userId:string): Promise<Array<IDirectory>> => {
  try {
    const doc = await Directory.find({
    asigned_user_ids:{$in:[userId]}},{_id:0,__v:0});
    let directoryResult: Array<IDirectory> =doc.map((singleDoc) => singleDoc.toObject());
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const getAllDirectoryBySharedUser = async (userId:string): Promise<Array<IDirectory>> => {
  try {
    const doc = await Directory.find({
      shared_user_ids:{$in:[userId]}},{_id:0,__v:0});
    let directoryResult: Array<IDirectory> =doc.map((singleDoc) => singleDoc.toObject());
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const removeDirectoryAsignedUser = async (entityId: string,userId:string): Promise<IDirectory> => {
  try {
    const doc = await Directory.findOneAndUpdate({
      entity_id: entityId
    },{$pull: { asigned_user_ids: userId}},{new:false});
    const directoryResult: IDirectory = await doc?.toObject();
    return directoryResult;
  } catch (error) {
    throw error;
  }
};
export const removeDirectoryById = async (entityId: string): Promise<number> => {
  try {
    const doc = await Directory.deleteOne({
      entity_id: entityId});
    const directoryResult: number =  doc.deletedCount as number;
    return directoryResult;
  } catch (error) {
    throw error;
  }
};

export const getAllSubDirectories = async (directory: SubDirectoryInputModel): Promise<SubDirectoryOutputModel> => {
  
  const limit = directory.limit ? directory.limit : 10;
  let filter:SubDirectoryFilterModel = {
    parent_directory_id: ""
  }; 
  if(directory.entity_id && directory.entity_id.trim().length){
    filter.parent_directory_id = directory.entity_id.trim();
  }
  if(directory.searchQuery && directory.searchQuery.trim().length){
    filter.entity_name = {$regex: new RegExp(directory.searchQuery.trim(), "i")};
  }
  if(directory.asigned_user_id && directory.asigned_user_id.trim().length){
    filter = {...filter, 
              ...{ $or:  [ 
                          {shared_user_ids: { $eq: directory.asigned_user_id.trim() }},
                          {asigned_user_ids: { $eq: directory.asigned_user_id.trim() }}
                         ]
                 } 
             };
  }
  try {
    const totalCount = await Directory.count(filter);
    const doc = await Directory.find(filter,
    {_id:0,__v:0})
    .skip(directory.page ? limit * directory.page : 0)
    .limit(limit)
    .sort({entity_updated: directory.sort ? directory.sort : -1 });
    const directoryResult: Array<IDirectory> = doc.map((singleDoc) => singleDoc.toObject());
    return {
            directoryResult,
            totalCount
          };
  } catch (error) {
    throw error;
  }
};