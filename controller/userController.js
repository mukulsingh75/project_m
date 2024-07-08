import Joi from "joi";
import bcrypt from "bcryptjs"
import User from "../model/user.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

import sendRegistrationEmail from "../services/emailServices.js";

const key = process.env.SEC_KEY;

const userController = {

    // register user
    registerUser : async(req,res)=>{
        console.log(req.body);

        // validate schema
        const userSchemaValidation = Joi.object({
            first_name : Joi.string().required(),
            last_name : Joi.string().required(),
            email : Joi.string().email().required(),
            phone_number : Joi.number().integer().min(0).required(),
            address : Joi.string().allow(null),
            password : Joi.string().required(),
            registration_type:Joi.string().required(),
            role: Joi.string().allow(null),
            social_id:Joi.string().allow(null)
        });

        // destruct values --

        const {error,value} = userSchemaValidation.validate(req.body);

        if(error){
            console.log(error.details);
            return res.status(403).json({success:false,message:error.details});
        }

        const { first_name, last_name, email, phone_number, address , password , registration_type , social_id} = value;

        try{

            // user schema set to unique:true so don't need to execute commented code

        // if(registration_type==='email'){
        //     let userExist = User.findOne({email:email});
        // }
        // if(userExist && userExist.status!=='unverified'){
        //     return res.status(400).json({success:false,message:"User already exists in database"});
        // }

        let hashPass = await bcrypt.hash(password,10);

        let status="unverified";

        const formData = {
            first_name,
            last_name,
            email, 
            phone_number,
            address,
            password:hashPass,
            registration_type,
            social_id,
            role:'user',
            status
        }
        

            let newUser = new User({...formData});
            console.log(newUser);

            // initially store user details in database
            let userStore = await newUser.save();
            const jwttoken = jwt.sign({id:userStore._id},key,{expiresIn:'1d'});
            console.log("working");
            await sendRegistrationEmail(email, jwttoken);

            return res.status(200).json({success:true,message:"User-registered successfully",userStore});
            
        }
        catch(err){
            console.log(err);
            return res.status(500).json({success:false,message:err.message,err});
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

        if(user.status === 'unverified'){
            return res.status(409).json({success:false,message:"User is not verified,plaese verify it"});
        }

        let response = bcrypt.compare(req.body.password,user.password);
        
        if(!response){
            return res.status(400).json({success:false,message:"password do not match"});
        }

        if(user.token){
            return res.status(406).json({success:false,message:"User already logged-in"});
        }
        

        //update token in database

        try{

            const jwttoken = jwt.sign({id:user._id},key,{expiresIn:'1d'});


            // Directly update the instance
            user.token = jwttoken;

            let userUpdate = await User.findByIdAndUpdate(user._id,{...user},{new:true});

            res.status(200).json({success:true,message:"logged-in successfully",Data:userUpdate,token:jwttoken});
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
                console.log("id  :  ",id);

                // update token to null
                let userUpd = await User.findByIdAndUpdate(id,{token:null},{new:true}); 

                console.log(userUpd);
                return res.status(200).json({success:true,message:"logged-out successfully",data:userUpd});
            } catch (error) {
                return res.status(500).json({success:false,message:"some error occured in logout"});
            }
    },

    // verify user
    verifyuser: async(req,res)=>{
        try {
            console.log("id:  "+req.body.userId);
            let updated = await User.findByIdAndUpdate(req.body.userId,{status:'verified'},{new:true});
            console.log(updated);
            if(updated){
                return res.status(200).json({success:true,message:'User-Account verified successfully',data:updated});
            }
        } catch (error) {
            return res.status(404).json({success:false,message:"user not verified",error});
        }
    }
    ,

    // resend verification mail

    resendMail:async(req,res)=>{
        console.log("resend mail",req.body);
        try {

            // for email login
            if(req.body.email){
                let userFound = await User.findOne({email:req.body.email});
                console.log(userFound);
                if(userFound && userFound.status==='unverified'){
                    let token = jwt.sign({id:userFound._id},key,{expiresIn:'1d'});
                    console.log(token);
                    const response = await sendRegistrationEmail(userFound.email,token);
                    return res.status(200).json(response);
                }
                else if(userFound.status==='verified'){
                    return res.status(400).json({success:false,message:"user is already verified"});
                }
            }

            // for google login
            if(req.body.registration_type==='google'){
                let soId = req.body.social_id;
                let userFound = await User.findOne({social_id:soId});

                let token = jwt.sign({id:userFound._id},key,{expiresIn:'1d'});

                const response = await sendRegistrationEmail(userFound.email,token);
                return res.status(200).json(response);
            }
            
            
        } catch (error) {
            return res.status(500).json({success:false,message:"some error occured",error});
        }
    }
    ,
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
                return res.status(200).json({success:false,message:"invalid credentials"});
            }
            

            // set token to null
            userFind.token = null;

            // generate token
            const jwtToken = jwt.sign({id:userFind._id},key,{expiresIn:'1d'})

            // set token with new one
            userFind.token = jwtToken;

            // update token with new one
            const userUpdate = await User.findOneAndUpdate({email:email},{...userFind},{new:true});
            return res.status(200).json({success:true,message:"you are logged in forcefully",data:userUpdate});

        } catch (error) {
            return res.status(400).json({success:true,message:"Some error occured"});
        }
    }
    ,
    
    // social login

    socialLogin : async(req,res)=>{
        console.log("social login  : ",req.body);

        try {
            const registrationValidation = Joi.object({
                social_id : Joi.string().required(),
                registration_type : Joi.string().valid("google","facebook").required()
            });  
    
            // validation
            const {error,value} = registrationValidation.validate(req.body);
    
            if(error){
                res.status(400).json({success:false,message:"Invalid credentials"});
            };
    
            const {social_id,register_type} = value;

            let userFound = await User.findOne({social_id});

            // console.log(userFound);

            if(userFound.status === 'unverified'){
                return res.status(409).json({success:false,message:"User is not verified,please verify it"});
            };

            if(userFound.token){
                return res.status(406).json({success:false,message:"user already logged-in"});
            };

            let id = userFound._id;

            const token = jwt.sign({userId:id},key,{expiresIn:'1d'});

            let userUpd = await User.findByIdAndUpdate(id,{token:token});

            return res.status(200).json({success:true,message:'You are logged in successfully',
                                        Data: {
                                            id: userUpd.id,
                                            first_name: userUpd.first_name,
                                            last_name: userUpd.last_name,
                                            email: userUpd.email,
                                            phone_number: userUpd.phone_number,
                                            status: userUpd.status,
                                            registration_type: userUpd.registration_type,
                                            social_id: userUpd.social_id,
                                            role: userUpd.role
                                        },token});
            

        } catch (error) {
            return res.status(500).json({success:false,message:"User not found"});
        }

        



    }
    

}

export {userController};