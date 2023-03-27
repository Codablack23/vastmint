const express = require("express")
const { getHomePage, getMarketplacePage, getSellersPage, getCollectionsPage, getCollectionPage, getSellerPage, getArtPage, getCartPage, getOrdersPage } = require("../controllers/home")

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
HomeRoute.get("/orders/",getOrdersPage)


module.exports = HomeRoute