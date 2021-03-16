import { Schema,model, Types } from "mongoose";
import { IDirectory } from "../Directory/Directory.Model";

export interface IUser {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password: string;
  user_company:string;
  user_type: string;
  user_role:string;
  created_by:string;
  user_status: number;
  user_created: string;
  user_updated: string;
  access_user_settings:boolean;
  change_password:boolean;
  favourite_entity_ids: Array<string>;
  favourite_entity:Array<IDirectory>;
}

export interface IFavouriteDirectory {
  user_id: string;
  user_type: string;
  entity_ids: Array<String>;
}

const UserSchema = new Schema<IUser>(
  {
    user_id: { type: Schema.Types.String, trim: true, unique:true},
    user_name: { type: Schema.Types.String },
    user_email: { type: Schema.Types.String, trim: true,unique:true },
    user_company: { type: Schema.Types.String, trim: true,default:"" },
    user_password: { type: Schema.Types.String, trim: true },
    user_type: { type: Schema.Types.String, trim: true,default:"USER" },
    user_role:{ type: Schema.Types.String, trim: true},
    created_by:{ type: Schema.Types.String, trim: true},
    user_status: { type: Schema.Types.Number, trim: true, default: 1},
    access_user_settings:{type:Schema.Types.Boolean, default:false},
    change_password:{type:Schema.Types.Boolean,default:false},
    favourite_entity_ids:{type:Schema.Types.Mixed,trim:true,default:[]},
  },
  { timestamps: { createdAt: "user_created", updatedAt: "user_updated" } }
);

const FavouriteDirectorySchema = new Schema<IFavouriteDirectory>(
  {
    user_id: { type: Schema.Types.String, trim: true, unique:true},
    user_type: { type: Schema.Types.String, trim: true },
    entity_ids:{type:Schema.Types.Array,trim:true,default:[]}
  },
  { timestamps: { createdAt: "user_favourite_directory_created", updatedAt: "user_favourite_directory_updated" } }
);


export const UserModel = model('users', UserSchema);

export const FavouriteDirectory=model('favourite_directory',FavouriteDirectorySchema);