const { v4 } = require("uuid")
const { Transaction, NFTModel, NFTHistory } = require("../models/nfts")
const { sendMail } = require("../utils/sendMail")
const { UserModel, Notifications, Orders } = require("../models/accounts")
const { getMintEmailHtml, getOrderEmailHtml, getPaymentEmailHtml, getTransactionCompleteHtml } = require("../utils/email_template")
const { Op } = require("sequelize")
const { getMintFee } = require("../utils/getMintFee")
const { getBalance } = require("../utils/getBalance")

module.exports={
    async startPayment(req,res){
        const {amount,type,status} = req.body
        const {name} = req.session.user
        const origin = req.headers.origin
        const {username,email} = req.session.user
        let response = {
            status:"loading",
            message:"loading",
            error:"loading",
            data:null
        }
        try {
            const payment_id = v4()
            console.log(req.body)
            await Transaction.create({
                payment_id,
                state:"pending",
                user:username,
                amount,
                type,
                status
            })
            await Notifications.create({
                title:"Transaction Started",
                type:"Transaction",
                message:"You have created a payment for a funding of account please be patient while we confirm and approve your transaction",
                reciever:username,
                user:name,
                message_id:v4()
            })
            await sendMail({
                from:"ArtSea",
                to:email,
                subject:"Transaction Created",
                html:getPaymentEmailHtml(origin,name)
            })
            response = {
               status:"success",
               data:{
                payment_id
               },
               error:"",
               message:"Payment has been started successfully and is now pending you will recieve a email when the payments is confirmed"
            }
        } catch (error) {
            console.log(error)
            response = {
              status:"failed",
              message:"",
              error:"An error occured in the server please try again later",
              data:null 
            }
        }
        res.json(response)

    },
    async completePayment(req,res){
        const {payment_id} = req.params
        const origin = req.headers.origin
        // const {username,name,email} = req.session.user
        let response = {
            status:"loading",
            message:"loading",
            error:"loading",
            data:null
        }
        try {
           const payment = await Transaction.findOne({
            where:{
                payment_id,
            }
           })
           console.log({payment})
           if(payment){
            const user = await UserModel.findOne({
               where:{
                username:payment.user
               }
            })
            console.log({user})
            await Transaction.update({ state:"completed"},{
                where:{
                    payment_id,
                }
            })
            
            await Notifications.create({
                title:"Transaction Confirmed",
                type:"Transaction",
                message:"Your transaction have been confirmed and your wallet have been funded",
                reciever:user.username,
                user:user.name,
                message_id:v4()
            })
            await sendMail({
                from:"ArtSea",
                to:user.email,
                subject:"Transaction Confirmed",
                html:getTransactionCompleteHtml(origin,payment_id,user.name)
            })
            response = {
               status:"success",
               data:null,
               error:"",
               message:"Payment has been completed successfully"
            }
           }else{
            response = {
                status:"failed",
                message:"",
                error:"Payment data does not exist",
                data:null
            }
           }
        } catch (error) {
            console.log(error)
            response = {
              status:"failed",
              message:"",
              error:"An error occured in the server please try again later",
              err:"An error occured in the server please try again later",
              data:null 
            }
        }
        res.json(response)

    },
    async mintNft(req,res){
        const origin = req.headers.origin
        const {username,name:reciever} = req.session.user
        const response = {
            status:"pending",
            message:"",
            err:"pending",
            data:null
        }
        const {name,price,description,attributes,nft_img,collection,collection_id} = req.body
        try {
           const user = await UserModel.findOne({
             where:{
                username
             }
           }) 
           const nftResponse = await NFTModel.findOne({
            where:{
                name,
            }
           })
           console.log({nftResponse})

           if(nftResponse == null){
            const nft_id = v4()
            await NFTModel.create({
              name,
              floor_price:price,
              current_price:price,
              description,
              nft_img,
              collection,collection_id,
              attributes:JSON.stringify(attributes),
              nft_id,
              owner:username,
              seller:username,
              meta_data:JSON.stringify({
                contract_address:`0x8${nft_id}`,
                contract_address_link:"",
                token_id:nft_id.slice(0,4),
                token_name:`${name} #${nft_id.slice(0,4)}`
             })
            })
            await NFTHistory.create({
                nft_id,
                type:"mint",
                user:username,
                from:"Artsea",
                to:reciever,
                amount:4,
                status:"credit"
            }) 
            const mintfee = await getMintFee()
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount:mintfee,
                type:"mint",
                status:"DEBIT"
            })
            await Notifications.create({
                title:"Mint successful",
                type:"mint",
                message:"You have Successfully minted a nft",
                reciever:user.username,
                user:user.name,
                message_id:v4()
            })
            await sendMail({
                from:"ArtSea",
                to:user.email,
                subject:"Mint Successful",
                html:getMintEmailHtml(origin,nft_id,user.name)
            })
            response.status = "success"
            response.message = "you have successfully created your NFT"
            response.err = ""
            response.data = {
                nft_id
            }
           }else{
            response.status="failed"
            response.message=""
            response.error="Nft name already exists please choose a unique name"
            response.err="Nft name already exists please choose a unique name"
            response.data=null 
           }

        } catch (error) {
            console.log(error)
            response.status="failed"
            response.message=""
            response.error="An error occured in the server please try again later"
            response.data=null 
            
        }
        res.json(response)
    },   
    async mintNftCollection(req,res){
        const origin = req.headers.origin
        const {username,name:reciever} = req.session.user
        const response = {
            status:"pending",
            message:"",
            err:"pending",
            data:null
        }
        const {name,price,description,attributes,nft_img,collection,collection_id} = req.body
        try {
           const user = await UserModel.findOne({
             where:{
                username
             }
           }) 
           const nftResponse = await NFTModel.findOne({
            where:{
                name,
            }
           })
           console.log({nftResponse})

           if(nftResponse == null){
            const nft_id = v4()
            await NFTModel.create({
              name,
              floor_price:price,
              current_price:price,
              description,
              nft_img,
              collection,collection_id,
              attributes:JSON.stringify(attributes),
              nft_id,
              owner:username,
              seller:username,
              meta_data:JSON.stringify({
                contract_address:`0x8${nft_id}`,
                contract_address_link:"",
                token_id:nft_id.slice(0,4),
                token_name:`${name} #${nft_id.slice(0,4)}`
             })
            })
            await NFTHistory.create({
                nft_id,
                type:"mint",
                user:username,
                from:"Artsea",
                to:reciever,
                amount:4,
                status:"credit"
            }) 
            const mintfee = await getMintFee()
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount:0,
                type:"mint",
                status:"DEBIT"
            })
            await Notifications.create({
                title:"Mint successful",
                type:"mint",
                message:"You have Successfully minted a nft",
                reciever:user.username,
                user:user.name,
                message_id:v4()
            })
            await sendMail({
                from:"ArtSea",
                to:user.email,
                subject:"Mint Successful",
                html:getMintEmailHtml(origin,nft_id,user.name)
            })
            response.status = "success"
            response.message = "you have successfully created your NFT"
            response.err = ""
            response.data = {
                nft_id
            }
           }else{
            response.status="failed"
            response.message=""
            response.error="Nft name already exists please choose a unique name"
            response.err="Nft name already exists please choose a unique name"
            response.data=null 
           }

        } catch (error) {
            console.log(error)
            response.status="failed"
            response.message=""
            response.error="An error occured in the server please try again later"
            response.data=null 
            
        }
        res.json(response)
    },
    async createOrder(req,res){
      const {items,amount} = req.body
      const {username,name,email} = req.session.user
      let response = {
        status:"loading",
        message:"loading",
        error:"loading",
        data:null
      }
      const order_id = v4()
      const orderItems = JSON.parse(items)
      console.log(orderItems)
      
     
      try {
        await Orders.create({
            items,
            amount,
            username,
            user:name,
            order_id
          })
          await Transaction.create({
            payment_id:order_id,
            amount,
            status:"DEBIT",
            user:username,
            type:"purchase",
            state:"pending"
          })
          await NFTHistory.bulkCreate(orderItems.map((item)=>{
            return ({
                nft_id:item.id,
                amount:item.price,
                user:username,
                from:item.seller,
                to:name,
                type:"purchase"
              })
          }))
          await NFTModel.update({
            owner:username
          },
          {
            where:{
                [Op.or]:orderItems.map(item=>({
                    nft_id:item.id
                }))
            }
          }
          )
          await Notifications.create({
            title:"Nft Order Creation",
            type:"Order",
            message:"You have created an order for an NFT purchase please be patient while we confirm and approve your order",
            reciever:username,
            user:name,
            message_id:v4()
        })
        const origin = req.headers.origin
        await sendMail({
            from:"ArtSea",
            to:email,
            subject:"NFT Order Created",
            html:getOrderEmailHtml(origin,order_id,name)
        })
          response.status="success"
          response.message="You have successfully made an order please wait patiently while we verify your payments"
          response.error=""
          response.err=""

      } catch (err) {
        console.log(err)
        response.status="failed"
        response.message=""
        response.error="An error occured in the server please try again later"
        response.data=null 
        
      }
      res.json(response)

    },
    async confirmBalance(req,res){
        const response = {
            status:"failed",
            error:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again",
            err:"Sorry you do not have enough funds to pay for the minting fee please fund your wallet and try again" 
        }
       try {
        const {username} = req.session.user
        const balance = await getBalance(username)
        const mint_fee = await getMintFee()
    
        if(balance >= mint_fee * 4){
            response.status = "success"
            response.err = ""
            response.error = ""
        }
       } catch (error) {
        console.log(error)
        response.status="failed"
        response.error="An error occured in the server please try again later"
        response.err=response.error
       }
       res.json(response)
    },
    async confirmColBalance(req,res){
        const {name} = req.body
        const response = {
            status:"failed",
            error:"Sorry you cannot upload because you do not have enough funds for minting please fund your wallet and try again", 
            err:"Sorry you cannot upload because you do not have enough funds for minting please fund your wallet and try again", 
        }
       try {
        const {username} = req.session.user
        const balance = await getBalance(username)
        const mint_fee = await getMintFee()
    
        if(balance >= mint_fee){
            const nft = await NFTModel.findOne({
                where:{
                    name,
                }
            })
            console.log({nft})
            if(nft){
                response.status="failed"
                response.error="Nft name already exists please choose a unique name"
                response.err=response.error
            }else{
                response.status = "success"
                response.err = ""
                response.error = ""
            }
        }
       } catch (error) {
        console.log(error)
        response.status="failed"
        response.error="An error occured in the server please try again later"
        response.err=response.error
       }
       res.json(response)
    }
    ,async getUserData(req,res){
        res.json(req.session.user)
    }
}