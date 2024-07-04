import express from "express";
import { userController } from "../controller/userController.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();


router.post("/register",userController.registerUser);

router.post("/login",userController.loginUser);

router.post("/logout",verifyToken,userController.logoutUser);

router.post("/forcelogin",userController.forceLogin);

router.post("/sociallogin");




export default router;