import express from "express";
import { userController } from "../controller/userController.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();


router.post("/register",userController.registerUser);

router.post("/login",userController.loginUser);

router.patch("/verify",verifyToken,userController.verifyuser);

router.post("/resendVerify",userController.resendMail);

router.get("/logoutuser",verifyToken,userController.logoutUser);

router.post("/forcelogin",userController.forceLogin);

router.post("/sociallogin",userController.socialLogin);




export default router;