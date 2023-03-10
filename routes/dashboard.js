const express = require("express")
const { getDashboardHome,getCollectionsPage, getArtPage } = require("../controllers/dashboard")

const DashboardRoute = express.Router()

DashboardRoute.get("/",getDashboardHome)
DashboardRoute.get("/collections",getCollectionsPage)
DashboardRoute.get("/art",getArtPage)

module.exports = DashboardRoute