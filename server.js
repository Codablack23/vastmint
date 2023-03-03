const express = require("express")
const dotenv = require('dotenv').config()
const express_session = require('express-session')
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
// app.use(express_session({
    
// }))

app.get("/",(req,res)=>{
    res.render("index.ejs",{
        title:"Home"
    })
})
app.get("/login",(req,res)=>{
    res.render("login.ejs",{
        title:"Login"
    })
})
app.get("/register",(req,res)=>{
    res.render("register.ejs",{
        title:"Register"
    })
})
app.get("/marketplace",(req,res)=>{
    res.render("marketplace.ejs",{
        title:"Marketplace",
        page:"marketplace",
    })
})
app.get("/sellers",(req,res)=>{
    res.render("sellers.ejs",{
        title:"Artists",
        page:"artists"
    })
})
app.get("/collections",(req,res)=>{
    res.render("collections.ejs",{
        title:"Collections",
        page:"collections"
    })
})
app.get("/collections/:id",(req,res)=>{
    res.render("collection.ejs",{
        title:"Collection ",
        page:"collections",
        collection_id:req.params.id
    })
})
app.get("/sellers/:id",(req,res)=>{
    res.render("seller.ejs",{
        title:"Artist",
        page:"artists",
        seller_id:req.params.id
    })
})