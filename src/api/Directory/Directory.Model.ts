import mongoose, { Schema } from "mongoose";
import { Environment } from "../../helpers/Environment";
import { string } from "@hapi/joi";

export interface IDirectory {
  entity_id: string;
  entity_name: string;
  entity_description: string;
  parent_directory_id: string;
  child_directory_ids: Array<string>;
  child_files_ids: Array<string>;
  directory_owner: string;
  is_directory: boolean;
  is_file: boolean;
  file_extension: string;
  file_type: string;
  entity_location: string;
  entity_status: number;
  entity_created: string;
  entity_updated: string;
  directory_access: Array<string>;
  directory_can_download_client_ids: Array<string>;
  directory_download_notification_client_ids: Array<string>;
  directory_can_upload_client_ids: Array<string>;
  directory_upload_notification_client_ids: Array<string>;
  directory_can_delete_client_ids: Array<string>;
  directory_is_admin_client_ids: Array<string>;
  shared_user_ids:Array<string>;
  asigned_user_ids:Array<string>;
}

export interface ISharedDirectory {
  user_id: string;
  user_type: string;
  entity_id: Array<String>;
}

export interface IParentDirectory {
  entity_name: string;
  entity_location: string;
}

const DirectorySchema = new Schema<IDirectory>(
  {
    entity_id: { type: Schema.Types.String, trim: true },
    entity_name: { type: Schema.Types.String, trim: true ,unique:true },
    entity_description: { type: Schema.Types.String },
    parent_directory_id: { type: Schema.Types.String, trim: true, default: "" },
    child_directory_ids: { type: Schema.Types.Mixed, trim: true, default: [] },
    child_files_ids: { type: Schema.Types.Mixed, trim: true, default: [] },
    directory_owner: { type: Schema.Types.String, trim: true },
    is_directory: { type: Schema.Types.Boolean, default: false },
    is_file: { type: Schema.Types.Boolean, default: false },
    file_extension: { type: Schema.Types.String, default: "", trim: true },
    file_type: { type: Schema.Types.String, trim: true, default: "" },
    entity_location: { type: Schema.Types.String, trim: true, default: "" },
    entity_status: { type: Schema.Types.Number, trim: true, default: 1 },
    directory_access: { type: Schema.Types.Mixed, trim: true, default: [] },
    directory_can_download_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    directory_download_notification_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    directory_can_upload_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    directory_upload_notification_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    directory_can_delete_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    directory_is_admin_client_ids: {
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    shared_user_ids:{
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
    asigned_user_ids:{
      type: Schema.Types.Mixed,
      trim: true,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "entity_created",
      updatedAt: "entity_updated",
    },
  }
);
const SharedDirectorySchema = new Schema<ISharedDirectory>(
  {
    entity_ids: { type: Schema.Types.String, trim: true, unique:true},
    user_id:{type:Schema.Types.Array,trim:true,default:[]}
  },
  { timestamps: { createdAt: "user_created", updatedAt: "user_updated" } }
);

export const Directory = mongoose.model("directories", DirectorySchema);

export interface SubDirectoryInputModel { 
  entity_id: string;
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: number;
}

export interface SubDirectoryOutputModel { 
  directoryResult: IDirectory[];
  totalCount: number;
}

export interface SubDirectoryFilterModel { 
  parent_directory_id: string;
  entity_name?: any;
}
