import { Schema,model, Types } from "mongoose";

export interface IToken {
  token: string;
  created_at: string;
  expires_at: string;
}

const minuteFromNow = () => {
  const timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 60 * 60);
  return timeObject;
};

const TokenSchema = new Schema<IToken>(
  {
    token: { type: Schema.Types.String, trim: true },
    expires_at: { type: Date, default: minuteFromNow }
  },
  { timestamps: { createdAt: "created_at"} }
);

export const TokenModel = model('tokens', TokenSchema);


