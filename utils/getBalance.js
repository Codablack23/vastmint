const { Transaction } = require("../models/nfts")

const calcBalance = (transactions)=>{
    const mainTransactions = transactions.filter(t=>t.type.toLowerCase() !== "purchase").filter(t=>t.type.toLowerCase() !== "sale")
    const credits = mainTransactions.filter((e)=>e.status.toLowerCase()==="credit" && e.state=="completed")
    const debits = mainTransactions.filter((e)=>e.status.toLowerCase()==="debit" && e.state=="completed")
    const creditTotal = parseFloat(credits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    const debitTotal = parseFloat(debits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    return creditTotal - debitTotal
}
const calcEarnings = (transactions)=>{
    const mainTransactions = transactions.filter(t=>t.type.toLowerCase() === "sale")
    return parseFloat(mainTransactions.reduce((total,t)=>total + parseFloat(t.amount),0))
        
}
module.exports.getEarnings=async(username)=>{
    try {
        const transactions = await Transaction.findAll({
            where:{
                user:username
            }
        })
        return calcEarnings(transactions)
       } catch (error) {
        console.log(error)
        return 0
       }
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
module.exports.calcEarnings = calcEarnings