import Joi from "joi";
import bcrypt from "bcryptjs"
import User from "../model/user.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const key = process.env.SEC_KEY;

const userController = {

    // register user
    registerUser : async(req,res)=>{

        // validate schema
        const userSchemaValidation = Joi.object({
            first_name : Joi.string().required(),
            last_name : Joi.string().required(),
            email : Joi.string().email().required(),
            phone_number : Joi.number().integer().min(0).required(),
            address : Joi.string().required(),
            password : Joi.string().required(),
            register_type:Joi.string().required(),
            social_id:Joi.string().allow(null)
        });

        const {error,value} = userSchemaValidation.validate(req.body);

        if(error){
            console.log(error.details);
            res.status(400).json({success:false,message:error.details})
        }

        const { first_name, last_name, email, phone_number, address , password , register_type , social_id} = value;

        let hashPass = await bcrypt.hash(password,10);

        const formData = {
            first_name,
            last_name,
            email, 
            phone_number,
            address,
            password:hashPass,
            register_type,
            social_id
        }
        

        try{

            let newUser = new User({...formData});
            console.log(newUser);

            // initially store user details in database
            let userStore = await newUser.save();

            return res.status(200).json({success:true,userStore});
            
        }
        catch(err){
            return res.status(500).json({success:false,err});
        }

    }
    ,

    // login user

    loginUser : async(req,res)=>{

        const userLoginValidation = Joi.object({
            email : Joi.string().email().required(),
            password : Joi.string().required()
        });

        const {error,value} = userLoginValidation.validate(req.body);

        let email = req.body.email;

        if(error){
            res.status(400).json({success:false,message:"validation failed"});
            return;
        }

        const user =  await User.findOne({email:email});

        if(!user){
            res.status(400).json({success:false,message:"user not exist"});
            return;
        }

        let response = bcrypt.compare(req.body.password,user.password);
        
        if(!response){
            return res.status(400).json({success:false,message:"password do not match"});
        }

        if(user.token){
            return res.status(400).json({success:false,message:"user already logged-in"});
        }

        const jwttoken = jwt.sign({id:user._id},key,{expiresIn:'1d'});

        

        //update token in database

        try{

            // Directly update the instance
            user.token = jwttoken;

            let userUpdate = await User.findByIdAndUpdate(user._id,{...user},{new:true});

            res.status(200).json({success:true,message:"logged-in successfully",data:user.token});
        }catch(err){
            res.status(400).json({success:false,message:"database not responding"})
        }
          
    }
    ,
    
    // logout user
    logoutUser : async(req,res)=>{
            // code here
            try {
                const id = req.body.userId;
                // console.log(id);

                // update token to null
                let userUpd = await User.findByIdAndUpdate(id,{token:null},{new:true}); 

                console.log(userUpd);
                res.status(200).json({success:true,message:"logged-out successfully",data:userUpd});
            } catch (error) {
                res.status(400).json({success:false,message:"some error occured"});
            }
    },

    // force login 
    forceLogin : async(req,res)=>{
        try {
            const email = req.body.email;
            const userFind = await User.findOne({email:email});
             
            // check if email exists 
            if(!userFind){
                res.status(400).json({success:false,message:"email doesn't exist"});
            }

            // password check 
            const pass = req.body.password;
            const passOk = bcrypt.compare(pass,userFind.password);
            if(!passOk){
                res.status(200).json({success:false,message:"invalid credentials"});
            }
            

            // set token to null
            userFind.token = null;

            // generate token
            const jwtToken = jwt.sign({id:userFind._id},key,{expiresIn:'1d'})

            // set token with new one
            userFind.token = jwtToken;

            // update token with new one
            const userUpdate = await User.findOneAndUpdate({email:email},{...userFind},{new:true});
            res.status(200).json({success:true,message:"you are logged in forcefully",data:userUpdate});

        } catch (error) {
            res.status(400).json({success:true,message:"Some error occured"});
        }
    }
    ,
    
    // social login

    socialLogin : async(req,res)=>{

        const registrationValidation = Joi.object({
            social_id : Joi.string().required(),
            register_type : Joi.string().valid("google","facebook").required()
        });  

        // validation
        const {error,value} = registrationValidation.validate(req.body);

        if(error){
            res.status(400).json({success:false,message:"Invalid credentials"});
        };

        const {social_id,register_type} = value;



    }
    

}

export {userController};