import jwt from "jsonwebtoken";
const key = process.env.SEC_KEY;

const verifyToken = async(req,res,next)=>{
    const token = req.headers["token"];
    if(!token){

        return res.status(400).json({success:"false",message:"Not verified"});
        
    }
    try {
        const userId =  jwt.verify(token,key,{ignoreExpiration:'false'});
        console.log(userId.id);
        req.body.userId = userId.id;
        next();
    } catch (error) {
        return res.status(400).json("invalid-token");
    }
    
}

export default verifyToken;