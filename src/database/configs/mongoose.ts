import { connect } from "mongoose";
import { Environment } from "../../helpers/Environment";

export const createMongooseConnection = async () => {
  try {
    const connection = await connect(
    //  "mongodb+srv://developerRupam:Abcd1234@cluster0.trkpf.#mongodb.net/ismart_db?retryWrites=true&w=majority",
    //"mongodb://developerRupam:Abcd1234@cluster0-shard-00-00.trkpf.mongodb.net:27017,cluster0-shard-00-01.trkpf.mongodb.net:27017,cluster0-shard-00-02.trkpf.mongodb.net:27017/ismart_db?ssl=true&replicaSet=atlas-xk9hom-shard-0&authSource=admin&retryWrites=true&w=majority",
    "mongodb://127.0.0.1:27017/smart-choice-formation",

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 50,
        useCreateIndex: true,
        useFindAndModify: false
      }
    );
    console.log("MongoDB Connected!!!");
    return connection;
  } catch (error) {
    console.log("Database error", error.message);
    process.exit(1);
  }
};
