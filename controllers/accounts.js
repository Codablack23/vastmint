const { v4 } = require("uuid")
const bcrypt = require("bcrypt")
const { UserModel } = require("../models/accounts")
const { sendMail } = require("../utils/sendMail")
const jwt = require("jsonwebtoken")
const { getResetEmailHtml } = require("../utils/email_template")


module.exports = {
    getLoginPage(req,res){
        const {name,password} = req.body
        const response = {
            status:"loading",
            error_type:"loading",
            error_message:"",
            message:"loading"
        }
        res.render("accounts/login.ejs",{
            title:"Login",
            values:{},
            response:{
                status:"loading"
            }
        })
    },
    async loginUser(req,res){
        const {email,password} = req.body
        const response = {
            status:"loading",
            message:"loading"
        }
        try {
           const user = await UserModel.findOne({
             where:{
                email
             }
           }) 
           console.log(user.password)
           const isPassword = await bcrypt.compare(password,user.password)
           if(isPassword){
            req.session.user = {
                username:user.username,
                email:user.email,
                name:user.name,
                user_id:user.user_id,
            }
            response.status = "success"
            response.error_type = ""
            response.message = "Continue To Dashboard"
            response.error_message = ""
           }
           else{
            response.status = "failed"
            response.error_type = "wrong password"
            response.message = ""
            response.error_message = "your password does not match"
           }
        } catch (error) {
            console.log(error)
            response.status = "failed"
            response.error_type = "internal server error"
            response.message = ""
            response.error_message = "An internal error occurred please try again later"
        }
        res.render("accounts/login.ejs",{
            title:"Login",
            values:req.body,
            response
        })
    },
    getRegisterPage(req,res){
        res.render("accounts/register.ejs",{
            title:"Register",
            values:{},
            response:{
                status:"loading"
            }
        })
    },
    async registerUser(req,res){
        const {name,password,email,username} = req.body
        const response = {
            status:"loading",
            error_type:"loading",
            error_message:"",
            message:"loading"
        }
        try {
            const salt = await bcrypt.genSalt(10)
            const enc_pass = await bcrypt.hash(password,salt)
            await UserModel.create({
              name,
              password:enc_pass,
              user_id:v4(),
              email,
              username,
              img_profile:"",
              banner_img:""
            })
            response.status = "success"
            response.error_type = ""
            response.message = "User created successfully please login to continue"
            response.error_message = ""
        } catch (error) {
            console.log(error)
            response.status = "failed"
            response.error_type = "internal server error"
            response.message = ""
            response.error_message = "An internal error occurred please try again later"
        }
        res.render("accounts/register.ejs",{
            title:"Forgot Password",
            values:req.body,
            response
        })
    },
    getForgotPasswordPage(req,res){
        res.render("accounts/forgot_password.ejs",{
            title:"Forgot Password",
            values:{},
            response:null
        })
    },
    async sendResetPasswordToken(req,res){
        const {email} = req.body
        const origin = req.headers.origin
        const response = {
            status:"loading",
            error_type:"loading",
            error_message:"",
            message:"loading"
        }
        try {
            const queryRes = await UserModel.findOne({
                where:{
                    email
                }
            })
            console.log(queryRes)
            if(queryRes){
                const token = jwt.sign({email},process.env.TOKEN_KEY,{expiresIn:60*60})
                const html = getResetEmailHtml(origin,token,queryRes.name)
                await sendMail({
                    from:"Vastmint",
                    to:email,
                    subject:"Reset Password",
                    html
                })
                response.message="A reset password link have been sent to your email"
                response.status = "success"
                response.error_type = ""
                response.error_message = ""

            }else{
                response.status = "failed"
                response.error_type = "Invalid User"
                response.message = ""
                response.error_message = "Sorry user with the email does not exist"  
            }
            
        } catch (error) {
            console.log(error)
            response.status = "failed"
            response.error_type = "internal server error"
            response.message = ""
            response.error_message = "An internal error occurred please try again later"
        }
        res.render("accounts/forgot_password.ejs",{
            title:"Forgot Password",
            values:{},
            response,
        })
    },
    getResetPasswordPage(req,res){
        let response = {
            status:"pending",
            message:"",
            error:"pending"
        }
        const token = req.params.token
         jwt.verify(token,process.env.TOKEN_KEY,(err,decoded)=>{
            if(err){
                // console.log(err)
                response.error = "This reset link is no longer valid"
                response.status = "failed"
                response.message = ""
            }else{
                response = null
            }
            res.render("accounts/reset_password.ejs",{
                title:"Reset Password",
                values:{},
                response,
           })
         })            
    },
    async ResetPassword(req,res){
        let response = {
            status:"pending",
            message:"",
            error:"pending"
        }
        const token = req.params.token
        const {password} = req.body
        const salt = await bcrypt.genSalt(10)
        const encPass = await bcrypt.hash(password,salt)
         jwt.verify(token,process.env.TOKEN_KEY,async(err,decoded)=>{
            if(err){
                // console.log(err)
                response.error = "This reset link is no longer valid"
                response.status = "failed"
                response.message = ""
            }else{
                try {
                  await UserModel.update({password:encPass},{
                    where:{
                        email:decoded.email
                    }
                  })
                  response.error = ""
                  response.status = "success"
                  response.message = "your password reset was successful"
                } catch (error) {
                    response.status = "failed"
                    response.message = ""
                    response.error = "An internal error occurred please try again later"
                }
            }
            res.render("accounts/reset_password.ejs",{
                title:"Reset Password",
                values:{},
                response,
           })
         })       
       
    }
}