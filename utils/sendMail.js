const nodemailer = require("nodemailer")


module.exports.sendMail=async({from,to,html,subject})=>{
    // const testAccount = await nodemailer.createTestAccount()
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
    host: process.env.EMAIL_SERVER || "mail.artisfymint.com",
    name:"artsealtd.com",
    port:  465,
    secure: true,// true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  })
    console.log(process.env.EMAIL_USER,process.env.EMAIL_PASSWORD)
    const info = await transporter.sendMail({
        from:`"Support" <${process.env.EMAIL_USER || "support@artisfymint.com"}>`,
        to,
        html,
        subject,
        text:null
     })

    console.log(info)
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
