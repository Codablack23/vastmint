const style = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap");
*{
  font-family:"Manrope",sans-serif;
}
body,html{
   
    padding: 0;
    margin: 0;
}
a{
    text-decoration: none;
    color: inherit;
}
.reset-container{
    background-color: #fff;
    max-width:600px;
    padding:1em;
    margin-inline:auto;
    min-height:250px
}
.reset-container .title{
    font-size:28px;
    margin-block:10px;
    margin-bottom: 1em;
    color:rgb(67,97,238);
}  
.reset-container .text{
    margin-bottom:1em;
    font-size:18px;
}
.reset-container .reset-link{
    padding:10px 1.5em;
    color:white;
    background-color:rgb(67,97,238);
    text-decoration:none;
    text-align: center;
    border-radius:8px;
    display: block;
    max-width: 150px;
}
.center{
    text-align: center;
}
`

module.exports.getResetEmailHtml = (origin,token,name)=>`
<html>
  <head>
    <style>
      ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">Reset Password</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">We have recieved a request to reset your password.</p>
        <p class="text">This link expires in 1hour if you didn't make this request kindly ignore this message otherwise click on the link to reset password.</p>
         <div class="center">
            <a class="reset-link" href="${origin}/accounts/reset-password/${token}">Reset password</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`

module.exports.getMintEmailHtml = (origin,token,name)=>`
<html>
  <head>
    <style>
    ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">Mint Successful</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">You have successfully minted and listed your nft</p>
        <p class="text">You can click on the link to view the nft </p>
         <div class="center">
            <a class="reset-link" href="${origin}/marketplace/${token}">View NFT listing</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`
module.exports.getOrderEmailHtml=(origin,token,name)=>`
<html>
  <head>
     <style>
     ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">NFT Order Creation</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">You have successfully created an order for purchasing some nfts</p>
        <p class="text">Please be patient while we confirm your order</p>
         <div class="center">
            <a class="reset-link" href="${origin}/orders/${token}">View Order</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`
module.exports.getPaymentEmailHtml=(origin,name)=>`
<html>
  <head>
     <style>
     ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">Transaction Creation</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">You have successfully created a transaction for wallet funding</p>
        <p class="text">Please be patient while we confirm your transaction</p>
         <div class="center">
            <a class="reset-link" href="${origin}/dashboard/wallet">View Transaction</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`

module.exports.getOrderHtml=(origin,token,name)=>`
<html>
  <head>
     <style>
     ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">NFT Order Approved</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">Your order ${token} has been approved and you now have ownership of the nfts you purchased </p>
         <div class="center">
            <a class="reset-link" href="${origin}/orders/">View Orders</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`
module.exports.getTransactionCompleteHtml=(origin,token,name)=>`
<html>
  <head>
     <style>
     ${style}
     </style>
  </head>
  <body>
    <div class="reset-container">
        <a href="${origin}/">Artisfymint</a>
        <h3 class="title">Transaction Approved</h3>
        <p class="text">Hi ${name}!</p>
        <p class="text">Your transaction ${token} has been approved and you account has been successfully funded</p>
         <div class="center">
            <a class="reset-link" href="${origin}/dashboard/wallet">View Transactions</a>
         </div>
         <p class="text">Thanks</p>
         <p class="text">The Artisfy team</p>
        </div>

    </div>
  </body>
</html>
`