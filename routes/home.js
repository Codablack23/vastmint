const express = require("express")
const { getHomePage, getLoginPage, getRegsiterPage, getMarketplacePage, getSellersPage, getCollectionsPage, getCollectionPage, getSellerPage, getArtPage } = require("../controllers/home")

const HomeRoute = express.Router()

HomeRoute.get("/",getHomePage)
HomeRoute.get("/login",getLoginPage)
HomeRoute.get("/register",getRegsiterPage)
HomeRoute.get("/marketplace",getMarketplacePage)
HomeRoute.get("/sellers",getSellersPage)
HomeRoute.get("/collections",getCollectionsPage)
HomeRoute.get("/collections/:id",getCollectionPage)
HomeRoute.get("/sellers/:id",getSellerPage)
HomeRoute.get("/marketplace/:id",getArtPage)


module.exports = HomeRoute