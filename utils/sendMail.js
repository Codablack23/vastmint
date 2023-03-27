const nodemailer = require("nodemailer")


module.exports.sendMail=async({from,to,html,subject})=>{
    const testAccount = await nodemailer.createTestAccount()
   console.log(testAccount)
   const response = {
    status:"pending",
    preview_url:null,
    error:"pending",
    message_id:null
   }
   try {
    let transporter = nodemailer.createTransport({
      //{
    //     host: "api.bubbookz.com",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //       user:"vastmint@api.bubbookz.com", // generated ethereal user
    //       pass: "@vastmint_password", // generated ethereal password
    //     },
    // }
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })

    const info = await transporter.sendMail({
        from,
        to,
        html,
        subject,
        text:null
     })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    response.error = null
    response.status = "success"
    response.preview_url = nodemailer.getTestMessageUrl(info)
    response.message_id = info.messageId
   } catch (error) {
     response.error = error,
     response.status = "failed"
     throw new Error(error)
  
   }
   return response
}
