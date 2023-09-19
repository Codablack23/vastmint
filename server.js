const express = require("express")
const fs = require('fs')
const dotenv = require('dotenv').config()
const express_session = require('express-session')
const HomeRoute = require("./routes/home")
const DashboardRoute = require("./routes/dashboard")
const accountRoute = require("./routes/account")
const { sequelize } = require("./config")
const { authenticateUsers } = require("./middlewares/auth")
const { connectDB } = require("./utils/connectDB")
const apiRoute = require("./routes/api")
const fileUpload = require("express-fileupload")
const SequelizeStore = require("connect-session-sequelize")(express_session.Store)
// const { sendMail } = require("./utils/sendMail")
const { UserModel, Admin } = require("./models/accounts")
const { Server } = require("socket.io")
const adminRoute = require("./routes/admin")
const bcrypt = require("bcrypt")
const { MintFee } = require("./models/init")
const { uploadToCloudinary } = require("./utils/upload")
const app = express()

const server = require("http").createServer(app)
const io = new Server(server)


const MAX_AGE = 1000*60*60*24*30
const FILE_LIMIT = 15 * 1024*1024

connectDB(sequelize).then(async(data)=>{
   if(data.status === "success"){
    const admin = await Admin.findAll()
    const mint = await MintFee.findAll()
 
    if(admin.length == 0){
     const salt = await bcrypt.genSalt(10)
     const password = await bcrypt.hash(process.env.ADMIN_KEY,salt)
     
     await Admin.create({
         admin_key:password
       })
    }
    if(mint.length == 0){
     await MintFee.create({
         mint_fee:process.env.MINT_FEE
     })
    }
   }
})




app.set("view engine","ejs")
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    limits:{
        fileSize:FILE_LIMIT
    },
    limitHandler:(req,res,next)=>{
            res.json({
                status:"failed",
                error:"file size exceeded 15MB"
        })
    }
}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use(express_session({
   secret:"peace out muthaf***kers",
   saveUninitialized:true,
   resave:true,
   cookie:{
    maxAge:MAX_AGE,
    sameSite:"lax"
   },
   store:new SequelizeStore({
    db:sequelize
   })
}))

app.use("",HomeRoute)
app.use("/dashboard",authenticateUsers,DashboardRoute)
app.use("/accounts",accountRoute)
app.use("/api",apiRoute)
app.use("/admin",adminRoute)

app.post("/upload/",async(req,res)=>{
    const file = req.files.file
    const response = {
        status:"pending",
        message:"",
        err:"pending",
        img_url:null,
    }
    if(!file || Object.keys(file).length === 0) {
       response.status ="failed",
       response.errr = "No files were uploaded."
    }
    else{
     const uploadRes = await uploadToCloudinary(file)
     if(uploadRes.status == "success"){
        response.img_url = uploadRes.url
        response.err = ""
        response.status = "success"
     }else{
         response.status ="failed"
         response.errr = "Could not upload this file due to some server error please try again later."
     }
    }
    res.json(response)
})
app.post("/upload/profile-img",async(req,res)=>{
    const {username} = req.session.user
    const file = req.files.file
    const response = {
        status:"pending",
        message:"",
        err:"pending",
        img_url:null,
    }
    if(!file || Object.keys(file).length === 0) {
       response.status ="failed",
       response.errr = "No file were uploaded."
    }
    else{
       try {
        const uploadRes = await uploadToCloudinary(file)
        if(uploadRes.status == "success"){
           response.img_url = uploadRes.url
           response.err = ""
           response.status = "success"
           await UserModel.update({
            img_profile: uploadRes.url
        },{
            where:{
                username
            }
        })
        }else{
            response.status ="failed"
            response.errr = "Could not upload this file due to some server error please try again later."
        }

       } catch (error) {
         response.status ="failed",
         response.errr = "could not update profile image"
       }
    }
    res.json(response)
})
app.post("/upload/banner-img",async(req,res)=>{
    const {username} = req.session.user
    const file = req.files.file
    const response = {
        status:"pending",
        message:"",
        err:"pending",
        img_url:null,
    }
    if(!file || Object.keys(file).length === 0) {
       response.status ="failed",
       response.errr = "No file were uploaded."
    }
    else{
       try {
        const uploadRes = await uploadToCloudinary(file)
        if(uploadRes.status == "success"){
           response.img_url = uploadRes.url
           response.err = ""
           response.status = "success"
           await UserModel.update({
            banner_img: uploadRes.url
        },{
            where:{
                username
            }
        })
        }else{
            response.status ="failed"
            response.errr = "Could not upload this file due to some server error please try again later."
        }

       } catch (error) {
         response.status ="failed",
         response.errr = "could not update profile image"
       }
    }
    res.json(response)
})
app.use((req,res)=>{
   res.status(404).render("404.ejs",{
    title:"404",
    user:null,
   })
})
app.use((err,req,res,next)=>{
    console.log(err)
    res.render("error.ejs",{
        title:"Error",
        user:null
    })
})

server.listen(process.env.PORT || 5501,()=>{
    console.log(`Server running on ${process.env.PORT || 5501}`)
})
io.on("connection",(socket)=>{
    console.log("Connection made ")
})