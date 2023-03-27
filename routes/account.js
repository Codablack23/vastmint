const express = require("express")
const {getLoginPage,
     getRegisterPage,
     getForgotPasswordPage,
     getResetPasswordPage, 
     registerUser, 
     loginUser,
     sendResetPasswordToken,
     ResetPassword
} = require("../controllers/accounts")
const { validateReg, validateLogin } = require("../middlewares/validate")

const accountRoute = express.Router()

accountRoute.get("/",getLoginPage)
accountRoute.get("/register",getRegisterPage)
accountRoute.get("/forgot-password",getForgotPasswordPage)
accountRoute.post("/forgot-password",sendResetPasswordToken)
accountRoute.get("/reset-password/:token",getResetPasswordPage)
accountRoute.post("/reset-password/:token",ResetPassword)
accountRoute.get("/logout",(req,res)=>{
    delete req.session.user
    res.json({
        message:"logged out",
        user:req.session.user
    })
    
})
accountRoute.post("/",validateLogin,loginUser)
accountRoute.post("/register",validateReg,registerUser)

// accountRoute.get("/register",getRegsiterPage)

module.exports = accountRoute