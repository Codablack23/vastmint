const {validationResult,check} = require("express-validator")
const { UserModel } = require("../models/accounts")

const validateRoute = (validations,url)=>{
    
    return async (req,res,next)=>{
       console.log(req.body)
       for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) ;
       }
        const errors = validationResult(req)
        if(errors.isEmpty()){
            return next()
        }
        res.render(url,{
            response:{
                status:"failed",
                error_type:"field_error",
                error_message:"",
                message:"",
                errors:errors.array(),
            },
            values:req.body,
            title:"Register",
        })

    }
}
const validateAPI = (validations)=>{
    return async (req,res,next)=>{
        await Promise.all(validations.map(validation=>validation.run(req)))
        const errors = validationResult(req)
        if(errors.isEmpty()){
            return next()
        }
        console.log(errors)
        res.status(400).json({
            errors
        })

    }
}


module.exports.validateLogin = validateRoute([
    check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value)=>{
        return UserModel.findOne({
            where:{
             email:value
           }
       }).then(user=>{
         if(!user){
            return Promise.reject("User does not exist")
         }
       })

    }),
    check("password")
    .isLength({min:8})
    .withMessage("Password should contain atleast 8 characters")
],"accounts/login.ejs")
module.exports.validateReg = validateRoute([
        check("email")
        .isEmail()
        .withMessage("invalid email format")
        .custom((value)=>{
            return UserModel.findOne({
                where:{
                 email:value
               }
           }).then(user=>{
             if(user){
                return Promise.reject("Email already in use")
             }
           })

        }),
        check("username")
        .not().isEmpty()
        .withMessage("Please fill out the username field")
        .isLength({min:3})
        .withMessage("Username should atleast be 3 characters long")
        .isAlphanumeric()
        .withMessage("Username should contain only alphabets and numbers")
        .custom((value)=>{
            return UserModel.findOne({
                where:{
                 username:value
               }
           }).then(user=>{
             if(user){
                return Promise.reject("Username already in use")
             }
           })

        }),   
        check("name")
        .isLength({min:3})
        .withMessage("Full Name should be atleast 3 characters long")
        .not().isEmpty()
        .withMessage("Please fill out the username field")
        ,
         check("password")
         .not().isEmpty()
         .withMessage("Please fill out the password field")
        .isLength({min:8})
        .withMessage("Password should contain atleast 8 characters")
        .not()
        .contains([" "])
        .withMessage("Password should not contain any whitespace")
    
        ],
        "accounts/register.ejs"
    )
