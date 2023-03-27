const express = require("express")
const { getAdminPage, getAdminLoginPage,loginAdmin, updateMintFee, getAdminUsersPage, getAdminTransactionsPage, getAdminOrdersPage, completePayment} = require("../controllers/admin")
const { authenticateAdmin } = require("../middlewares/auth")

const adminRoute = express.Router()
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))



adminRoute.get("/",authenticateAdmin,getAdminPage)
adminRoute.get("/login",getAdminLoginPage)
adminRoute.get("/users",authenticateAdmin,getAdminUsersPage)
adminRoute.get("/transactions",authenticateAdmin,getAdminTransactionsPage)
adminRoute.get("/orders",authenticateAdmin,getAdminOrdersPage)
adminRoute.post("/orders/complete/:id",completePayment)
adminRoute.post("/login",loginAdmin)
adminRoute.get("/logout",async(req,res)=>{
    await delete req.session.admin
    res.json({
        status:"logged out",
        message:"logged out from vastmint"
    })
})
adminRoute.post("/mint_fee/update",updateMintFee)


module.exports = adminRoute