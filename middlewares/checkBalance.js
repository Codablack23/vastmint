const { getBalance } = require("../utils/getBalance")
const { getMintFee } = require("../utils/getMintFee")

module.exports.checkBalance = async (req,res,next)=>{
    const {username} = req.session.user
    const balance = await getBalance(username)
    const mint_fee = await getMintFee()

    console.log({mint_fee,balance})
    if(balance > mint_fee){
        return next()
    }
    res.json({
       status:"failed",
       error:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again",
       err:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again" 
    })
}