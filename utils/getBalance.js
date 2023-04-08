const { Transaction } = require("../models/nfts")

const calcBalance = (transactions)=>{
    const mainTransactions = transactions.filter(t=>t.type.toLowerCase() !== "purchase" )
    const credits = mainTransactions.filter((e)=>e.status.toLowerCase()==="credit" && e.state=="completed")
    const debits = mainTransactions.filter((e)=>e.status.toLowerCase()==="debit" && e.state=="completed")
    const creditTotal = parseFloat(credits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    const debitTotal = parseFloat(debits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    return creditTotal - debitTotal
}
const calcEarnings = (transactions)=>{
    const mainTransactions = transactions.filter(t=>t.type.toLowerCase() === "sale" )
    const credits = mainTransactions.filter((e)=>e.status.toLowerCase()==="credit" && e.state=="completed")
    const debits = transactions.filter((e)=>e.status.toLowerCase()==="debit" && e.state=="completed")
    const creditTotal = parseFloat(credits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    const debitTotal = parseFloat(debits.reduce((a,b)=>(a + parseFloat(b.amount)),0)).toFixed(3)
    return creditTotal - debitTotal
        
}
module.exports.getEarnings=async()=>{
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