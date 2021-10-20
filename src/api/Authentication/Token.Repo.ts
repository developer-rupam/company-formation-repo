import { IToken, TokenModel } from "./Token.Model";
import cryptoRandomString from 'crypto-random-string';

const minuteFromNow = () => {
  const timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 60 * 60);
  return timeObject;
};

export const generateToken = async () => {
  const token = cryptoRandomString(1000);
  try {
    const doc = await TokenModel.create({
      token: token
    });
    const result: IToken = await doc.toObject();
    if(result && result !== null && result !== undefined){
      return token;
    }else
      return null;  
  } catch (error) {
    throw error;
  }
};

export const checkToken = async (token: string): Promise<IToken> => {
  try {
    const doc = await TokenModel.findOne(
      {
        token: token,
        expires_at: {$gte: Date.now()}
      },
      { _id: 0, __v: 0 }
    );
    const userResult: IToken = doc?.toObject();
    return userResult;
  } catch (error) {
    throw error;
  }
};

const updateToken = async (token: string): Promise<number> => {
  try {
    const doc= await TokenModel.updateOne({ token: token},{$set:{
      expires_at: minuteFromNow()
    }},{ upsert:false });
    const result =  doc.nModified;
    return result;
  } catch (error) {
    throw error;
  }
};

export const authorizeToken = async (authHeaders) => {
  if(authHeaders && authHeaders.authorization){
    const token = authHeaders.authorization.slice(7);
    const tokenExists = await checkToken(token);
    if(tokenExists){
      const result = await updateToken(token)
      if(result){
        return token;
      }
    }
    return;
  }
};

