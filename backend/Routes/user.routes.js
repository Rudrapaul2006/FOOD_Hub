import express from 'express';
import { currentUser, login, logout, register, resetPassword, sendOtp, updateDelivaryBoysAvailability, updatePosition, userOrderAddressUpdate, userProfile, userUpdate, verifyOtp} from '../Controllers/user.controller.js';
import { isAuth } from '../isAuth/isAuthentication.js';
import { upload } from '../isAuth/multer.js';

let UserRoute = express.Router();


UserRoute.post('/register',register)
UserRoute.post('/login',login)
UserRoute.get("/logout",logout)

//User curd:

UserRoute.put("/update", isAuth, upload.single("image"), userUpdate)   
UserRoute.get("/profile",isAuth, userProfile)

//Update user Address :
UserRoute.put("/addressUpdate",isAuth, userOrderAddressUpdate)
//update user geo location : 
UserRoute.put("/updatelocation" , isAuth , updatePosition)


//Get current user :
UserRoute.get("/currentuser" , isAuth, currentUser)


//Update availability :
UserRoute.put("/updateavailability" , isAuth , updateDelivaryBoysAvailability)


//Reset password field :
UserRoute.post("/send-otp",sendOtp)
UserRoute.post("/verify-otp",verifyOtp)
UserRoute.post("/reset-password",resetPassword)

export default UserRoute;