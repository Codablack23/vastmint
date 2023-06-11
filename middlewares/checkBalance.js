const { getBalance, getEarnings } = require("../utils/getBalance")
const { getMintFee } = require("../utils/getMintFee")

module.exports.checkBalance = async (req,res,next)=>{
    // console.log(req.session)
    const {username} = req.session.user
    const balance = await getBalance(username)
    const mint_fee = await getMintFee()

    console.log({mint_fee,balance})
    if(balance >= mint_fee){
        return next()
    }
    res.json({
       status:"failed",
       error:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again",
       err:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again" 
    })
}
module.exports.checkCollectionBalance = async (req,res,next)=>{
    const {username} = req.session.user
    const balance = await getBalance(username)
    const mint_fee = await getMintFee()

    
    if(balance >= mint_fee * 4){
        return next()
    }
    res.json({
       status:"failed",
       error:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again",
       err:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again" 
    })
}
module.exports.checkWithDrawBalance = async (req,res,next)=>{
    // console.log(req.session)
    const {username} = req.session.user
    const balance = await getEarnings(username)
    console.log(balance)

    console.log(balance)
    if(balance >= 7){
        return next()
    }
    res.json({
       status:"failed",
       error:"Sorry you have to earn atleast $12,000 (7ETH) to request for a withdraw",
       err:"Sorry you have to earn atleast $12,000 (7ETH) to request for a withdraw",
    })
}