const { Transaction } = require("../models/nfts")

const calcBalance = (transactions)=>{
    const mainTransactions = transactions.filter(t=>t.type.toLowerCase() !== "purchase" )
    return (parseFloat(mainTransactions.filter((e)=>e.status.toLowerCase()==="credit" && e.state=="completed")                   
    .reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)) - parseFloat(mainTransactions.filter((e)=>e.status.toLowerCase()==="debit" && e.state=="completed")                   
    .reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
}
module.exports.getBalance = async(username)=>{
   try {
    const transactions = await Transaction.findAll({
        where:{
            user:username
        }
    })
    return calcBalance(transactions)
   } catch (error) {
    console.log(error)
    return 0
   }
}

module.exports.calcBalance = calcBalance