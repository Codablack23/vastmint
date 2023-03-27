const { MintFee } = require("../models/init")

module.exports.getMintFee = async ()=>{
    try {
        return (await MintFee.findOne()).mint_fee
    } catch (error) {
        console.log(error)
        return process.env.MINT_FEE
    }
}