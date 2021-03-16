import { mkdir, copyFile, unlink, rename } from "fs";
import { join,extname} from "path";
import { promisify } from "util";
import { resolve } from "path";
import {remove} from 'fs-extra';

export const renameDirectory = async (oldDirectoryLocation: string, newDirectoryLocation: string): Promise<string> => {
  const promisifyMakeDirectory = promisify(rename);
  try {
    // const newDirectoryLocation: string = join(
    //   destinationLocation.trim(),
    //   newDirectoryName.trim()
    // );
    // console.log('oldDirectoryLocation', oldDirectoryLocation, newDirectoryLocation);

    await promisifyMakeDirectory(oldDirectoryLocation, newDirectoryLocation);
    return newDirectoryLocation;
  } catch (error) {
    throw error;
  }
};

export const makeDirectory = async (directoryName: string,destinationLocation: string): Promise<string> => {
  const promisifyMakeDirectory = promisify(mkdir);
  try {
    const actualDirectoryLocation: string = join(
      destinationLocation.trim(),
      directoryName.trim()
    );
    await promisifyMakeDirectory(actualDirectoryLocation, { recursive: true });
    return actualDirectoryLocation;
  } catch (error) {
    throw error;
  }
};
export const copyFileFromDestination = async (sourceLocation:string,destinationLocation: string,fileName:string): Promise<string> => {
  const promisifyCopyFile = promisify(copyFile);
  try {
    const absoluteDestinationLocation=join(destinationLocation,fileName)
    await promisifyCopyFile(sourceLocation,absoluteDestinationLocation);
    return absoluteDestinationLocation;
  } catch (error) {
    throw error;
  }
};
export const getAbsoluteFolderLocation = async (folderDestination: string): Promise<string> => {
  try {
    console.log(folderDestination);
    const destinationLocation = join(folderDestination, "/");
    console.log(destinationLocation);
    
    return destinationLocation;
  } catch (error) {
    throw error;
  }
};
export const getFileType = async (filePath: string): Promise<string> => {
    try {
      const extensionName = extname(filePath) as string;
      return extensionName;
    } catch (error) {
      throw error;
    }
  };
  // export const removeFile = async (filePath: string) => {
  //   const promisifyUnlink = promisify(unlink);
  //   try {
  //     await promisifyUnlink(filePath);
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  export const removeFile = async (filePath: string) => {
    const promisifyRemove = promisify(remove);
    try {
      await promisifyRemove(filePath);
    } catch (error) {
      throw error;
    }
  };
