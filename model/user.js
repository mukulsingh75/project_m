import mongoose from "mongoose";


const schema = mongoose.Schema;


// schema for user

const userSchema = new schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
        required : true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    phone_number : {
        type : Number,
        required:true
    },
    address : {
        type : String,
        required:true
    },
    password : {
        type: String,
        required: true
    },
    token:{
        type:String,
        default:null
    },
    register_type:{
        type:String,
        default:"email"
    },
    social_id:{
        type:String,
        default:null
    }
});

const User = mongoose.models.user || mongoose.model("user",userSchema);

export default User;