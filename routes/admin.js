const express = require("express")
const { getAdminPage, getAdminLoginPage,loginAdmin,getAdminUserPage,updateMintFee, getAdminUsersPage, getAdminTransactionsPage, getAdminOrdersPage, completePayment, clearBalance,clearEarnings, addEarnings, addFunds} = require("../controllers/admin")
const { authenticateAdmin } = require("../middlewares/auth")

const adminRoute = express.Router()
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))



adminRoute.get("/",authenticateAdmin,getAdminPage)
adminRoute.get("/login",getAdminLoginPage)
adminRoute.get("/users",authenticateAdmin,getAdminUsersPage)
adminRoute.get("/users/:username",authenticateAdmin,getAdminUserPage)
adminRoute.get("/transactions",authenticateAdmin,getAdminTransactionsPage)
adminRoute.get("/orders",authenticateAdmin,getAdminOrdersPage)
adminRoute.post("/orders/complete/:id",completePayment)
adminRoute.post("/login",loginAdmin)
adminRoute.post("/clear-balance",authenticateAdmin,clearBalance)
adminRoute.post("/clear-earnings",authenticateAdmin,clearEarnings)
adminRoute.post("/add-earnings",authenticateAdmin,addEarnings)
adminRoute.post("/add-funds",authenticateAdmin,addFunds)
adminRoute.post("/add-balance",authenticateAdmin,loginAdmin)
adminRoute.get("/logout",async(req,res)=>{
    await delete req.session.admin
    res.json({
        status:"logged out",
        message:"logged out from vastmint"
    })
})
adminRoute.post("/mint_fee/update",updateMintFee)


module.exports = adminRoute