const express = require("express")
const dotenv = require('dotenv').config()
const express_session = require('express-session')
const HomeRoute = require("./routes/home")
const DashboardRoute = require("./routes/dashboard")
// const ejsLayouts = require('express-ejs-layouts')

const app = express()

const server = app.listen(process.env.PORT || 5501,()=>{
    console.log(`Server running on ${process.env.PORT || 5501}`)
    if(process.send){
        process.send("online")
    }
})

app.set("view engine","ejs")
app.use(express.static('public'))

app.use("",HomeRoute)
app.use("/dashboard",DashboardRoute)