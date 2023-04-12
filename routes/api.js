const express = require("express")
const { startPayment,completePayment, mintNft, createOrder, confirmBalance,confirmColBalance, getUserData } = require("../controllers/api")
const { checkBalance } = require("../middlewares/checkBalance")

const apiRoute = express.Router()
apiRoute.use(express.json())
apiRoute.use(express.urlencoded({extended:true}))



apiRoute.post("/payment/create",startPayment)
apiRoute.post("/payment/complete/:payment_id",completePayment)
apiRoute.post("/nft/mint",checkBalance,mintNft)
apiRoute.post("/orders/create",createOrder)
apiRoute.post("/wallet/check-balance",confirmBalance)
apiRoute.post("/wallet/check-balance/collection",confirmColBalance)
apiRoute.get("/user/details",getUserData)



module.exports = apiRoute