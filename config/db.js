import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URL;

// connecting to mongodb (local)

async function connectDb(){

    // check for url
    if(!url){
        console.log("database url not found");
        return;
    }

    try{
        await mongoose.connect(url);
        console.log("Connected to db successfully");
    }
    catch(err){
        console.log("error connecting to db");
    }
}


export default connectDb;