const LazerPay = require("lazerpay-node-sdk")

const lazerPay = new LazerPay(process.env.LZ_PUBLIC,process.env.LZ_SECRET)

module.exports.makePayment = async(payload)=>{
  try {
    const response = await lazerPay.Payment.initializePayment(transaction_payload);
    return response
  } catch (error) {
    console.log(error)
    return {
          status:"failed",
          message:"could not initialize your payment"
    }
  }
}