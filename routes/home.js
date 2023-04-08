const express = require("express")
const { getHomePage, getMarketplacePage, getSellersPage, getCollectionsPage, getCollectionPage, getSellerPage, getArtPage, getCartPage, getOrdersPage } = require("../controllers/home")
const { authenticateUsers } = require("../middlewares/auth")

const HomeRoute = express.Router()

HomeRoute.get("/",getHomePage)
HomeRoute.get("/marketplace",getMarketplacePage)
HomeRoute.get("/sellers",getSellerPage)
HomeRoute.get("/collections",getCollectionsPage)
HomeRoute.get("/collections/:id",getCollectionPage)
HomeRoute.get("/sellers/:id",getSellersPage)
HomeRoute.get("/marketplace/:id",getArtPage)
HomeRoute.get("/marketplace/bid/:id",getArtPage)
HomeRoute.get("/cart/",getCartPage)
HomeRoute.get("/privacy-policy",(req,res)=>{
   res.render("privacy-policy.ejs",{
    title:"Privacy Policy",
    page:"privacy-policy",
    response:null,
    user:req.session.user
   })
})
HomeRoute.get("/about",(req,res)=>{
    res.render("about.ejs",{
        title:"About",
        page:"about",
        response:null,
        user:req.session.user
    })
 })
HomeRoute.get("/terms-of-service",(req,res)=>{
    res.render("terms-of-service.ejs",{
        title:"Terms of Service",
        page:"terms-of-service",
        response:null,
        user:req.session.user
    })
 })
HomeRoute.get("/orders/",authenticateUsers,getOrdersPage)


module.exports = HomeRoute