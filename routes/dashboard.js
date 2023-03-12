const express = require("express")
const { getDashboardHome,getCollectionsPage, getArtPage, getNotificationsPage, getWalletPage } = require("../controllers/dashboard")

const DashboardRoute = express.Router()

DashboardRoute.get("/",getDashboardHome)
DashboardRoute.get("/collections",getCollectionsPage)
DashboardRoute.get("/art",getArtPage)
DashboardRoute.get("/notifications",getNotificationsPage)
DashboardRoute.get("/wallets",getWalletPage)

module.exports = DashboardRoute