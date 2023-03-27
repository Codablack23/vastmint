const express = require("express")
const { 
    getDashboardHome,
    getCollectionsPage,
    getArtPage,
    getNotificationsPage, 
    getWalletPage, 
    getMintPage, 
    getSingleArtPage, 
    getProfilePage,
    getSettingsPage,
    changePassword,
    updateProfile,
    getCreateCollectionPage,
    createCollection,
    getCollectionPage,
    getFundPage,
    fundAccount,
    createTransaction
 } = require("../controllers/dashboard")


const DashboardRoute = express.Router()

DashboardRoute.get("/",getDashboardHome)
DashboardRoute.get("/collections",getCollectionsPage)
DashboardRoute.get("/collections/create",getCreateCollectionPage)
DashboardRoute.post("/collections/create",createCollection)
DashboardRoute.get("/collections/:id",getCollectionPage)
DashboardRoute.get("/art",getArtPage)
DashboardRoute.get("/art/:id",getSingleArtPage)
DashboardRoute.get("/profile",getProfilePage)
DashboardRoute.get("/settings",getSettingsPage)
DashboardRoute.post("/settings",updateProfile)
DashboardRoute.get("/mint",getMintPage)
DashboardRoute.get("/notifications",getNotificationsPage)
DashboardRoute.get("/wallets",getWalletPage)
DashboardRoute.get("/change-password",getSettingsPage)
DashboardRoute.get("/fund",getFundPage)
DashboardRoute.post("/fund",createTransaction)
DashboardRoute.post("/change-password",changePassword)

module.exports = DashboardRoute