const express = require("express")
const dotenv = require('dotenv').config()
const express_session = require('express-session')

const app = express()

const server = app.listen(process.env.PORT || 5501,()=>{
    console.log(`Server running on ${process.env.PORT || 5501}`)
})

app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express_session({
    
}))
