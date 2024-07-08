import jwt from "jsonwebtoken";
const key = process.env.SEC_KEY;

const verifyToken = async(req,res,next)=>{
    const token = req.headers["token"];
    console.log("req headers",req.headers["token"]);
    if(!token){

        return res.status(400).json({success:"false",message:"Not verified"});
        
    }
    try {
        const response =  jwt.verify(token,key,{ignoreExpiration:'false'});
        console.log(response.userId);
        req.body.userId = userId;
        console.log("req.body : ",req.body.userId);
        next();
    } catch (error) {
        return res.status(400).json("invalid-token");
    }
    
}

export default verifyToken;