const { Admin, Orders, UserModel, Notifications } = require("../models/accounts")
const {Op} = require("sequelize")
const bcrypt = require('bcrypt')
const { MintFee } = require("../models/init")
const { NFTCollection, Transaction, NFTModel } = require("../models/nfts")
const { sendMail } = require("../utils/sendMail")
const { getOrderHtml, getPurcahseHtml } = require("../utils/email_template")
const {v4} = require("uuid")
const { calcBalance, calcEarnings } = require("../utils/getBalance")

module.exports = {
   async getAdminPage(req,res){
      let mint_fee = null
        try {
            response = await MintFee.findAll()
            mint_fee = response[0].mint_fee
        } catch (error) {
            console.log(error)
        }
        res.render("admin/index.ejs",{
            title:"Admin",
            page:"admin",
            mint_fee,
            response:null
        })
    },
    getAdminLoginPage(req,res){
        res.render("admin/login.ejs",{
            title:"Admin Login",
            page:"login",
        })
    }, 
     async getAdminOrdersPage(req,res){
        const response = {
            status:"pending",
            error:"pending",
            message:null,
            orders:null
        }
        try {
            const orders = await Orders.findAll()
            response.orders = orders
            response.status = "success"
            response.message = "Fetched"
        } catch (error) {
            console.log(error)
            response.status = "failed"
            response.error = "sorry could not connect at the moment please try again later"
        }
        res.render("admin/orders.ejs",{
            title:"Admin Orders",
            page:"orders",
            response,
        })
    },
    async getAdminUsersPage(req,res){
        let response;
        const {query} = req.query
        try {
            const sellersRes = await UserModel.findAll({
                attributes:{exclude:["password"]},
            })
            const collectionRes = await NFTCollection.findAll({ })
            const sellers = sellersRes.map(seller=>({
                ...seller.dataValues,
                collections:collectionRes.filter(coll=>coll.seller==seller.username)
            }))
            response = {
                sellers:sellers.filter(seller=>seller.name.toLowerCase().includes(query?query.toLowerCase():"") || seller.username.toLowerCase().includes(query?query.toLowerCase():"")),
                status:"success",
                error:""
            }
        } catch (error) {
           console.log(error)
            response = {
                sellers:[],
                status:"failed",
                error:"Could not fetch Users"
            }
        }
        res.render("admin/users.ejs",{
            title:"Admin Users",
            page:"users",
            response
        })
    },
    async getAdminUserPage(req,res){
        let response;
        const {username} = req.params
        try {
            const user = await UserModel.findOne({
                where:{username},
                attributes:{exclude:["password"]},
            })  
            if(user){
                const transactions = await Transaction.findAll({
                    where:{user:username},
                    attributes:{exclude:["password"]},
                }) 
    
                const balance = calcBalance(transactions)
                const earnings = calcEarnings(transactions)
                
                response = {
                    user,
                    status:"success",
                    balance,
                    earnings,
                    error:""
                }
            }else{
                response = {
                    sellers:null,
                    status:"failed",
                    error:"User does not exist"
                }
            }
        } catch (error) {
           console.log(error)
            response = {
                sellers:null,
                status:"failed",
                error:"Could not fetch User"
            }
        }
        res.render("admin/user.ejs",{
            title:`Admin User | ${username}`,
            page:"users",
            response
        })
    },
    async getAdminTransactionsPage(req,res){
        const response = {
            status:"pending",
            error:"pending",
            message:null,
            transactions:null
        }
        try {
            const orders = await Transaction.findAll()
            response.transactions = orders
            response.status = "success"
            response.message = "Fetched"
        } catch (error) {
            console.log(error)
            response.status = "failed"
            response.error = "sorry could not connect at the moment please try again later"
        }
        res.render("admin/transactions.ejs",{
            title:"Admin Transactions",
            page:"transactions",
            response,
        })
    },
    
    async loginAdmin(req,res){
        const response = {
            status:"failed",
            error:"Unauhorized",
            message:""
        }
        const {admin_key} = req.body
        try {
            const admin = await Admin.findOne()
            console.log(admin)
            if(admin){
                const isCorrect = await bcrypt.compare(admin_key,admin.admin_key)
                
              if(isCorrect){
                 req.session.admin = {
                    admin_key
                 }
                 response.status = "success"
                 response.error = ""
                 response.message = ""
                  res.redirect("/admin/")
              }
            }else{
                console.log(response)
                res.render("admin/login.ejs",{
                    title:"Admin Login",
                    page:"login",
                    response
                })
            }
        } catch (error) {
            console.log(error)
          response.error = "Sorry an error occurred within servers" 
          console.log(response)
          res.render("admin/login.ejs",{
              title:"Admin Login",
              page:"login",
              response
          })
        }
       
    },
    async updateMintFee(req,res){
        const {mint_fee} = req.body
        const response = {
            status:"failed",
            error:"Unauhorized",
            message:""
        }
        try {
            await MintFee.update({mint_fee:parseFloat(mint_fee)},{
                where:{
                    id:{
                        [Op.gt]:0
                    }
                }
            })
            response.status = "success"
            response.error = ""
            response.message = "Mint fee was updated successfully"

        } catch (error) {
            console.log(error)
            response.error = "Sorry an error occurred within servers" 
        }
        console.log(response)
        res.render("admin/index.ejs",{
            title:"Admin",
            page:"admin",
            mint_fee,
            response
        })
    },
    async clearBalance(req,res){
        // const origin = req.headers.origin
        const {username} = req.body
        const response = {
           status:"failed",
           error:"could not update balance due to some server error",
           message:""
        }
        try {
            const transactions = await Transaction.findAll({
                where:{user:username},
            }) 
            const balance = calcBalance(transactions)
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount:balance,
                type:"Clear",
                status:"DEBIT"
            })
            response.error = null
            response.status = "success"
            response.message = "Balance Cleared Successfully"
        } catch (error) {
            console.log(error)
        }
        res.json(response)
    },  
    async addFunds(req,res){
        // const origin = req.headers.origin
        const {username,amount} = req.body
        const response = {
           status:"failed",
           error:"could not update balance due to some server error",
           message:""
        }
        try {
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount,
                type:"Funding",
                status:"CREDIT"
            })
            response.error = null
            response.status = "success"
            response.message = "Funds Added Successfully"
        } catch (error) {
            console.log(error)
        }
        res.json(response)
    },     
    async addEarnings(req,res){
        // const origin = req.headers.origin
        const {username,amount} = req.body
        const response = {
           status:"failed",
           error:"could not update balance due to some server error",
           message:""
        }
        try {
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount,
                type:"sale",
                status:"CREDIT"
            })
            response.error = null
            response.status = "success"
            response.message = "Earnings Added Successfully"
        } catch (error) {
            console.log(error)
        }
        res.json(response)
    }, 
    async clearEarnings(req,res){
        // const origin = req.headers.origin
        const {username} = req.body
        const response = {
           status:"failed",
           error:"could not update balance due to some server error",
           message:""
        }
        try {
            const transactions = await Transaction.findAll({
                where:{user:username},
            }) 
            const earnings = calcEarnings(transactions)
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount:earnings,
                type:"withdraw",
                status:"DEBIT"
            })
            response.error = null
            response.status = "success"
            response.message = "Earnings Cleared Successfully"
        } catch (error) {
            console.log(error)
        }
        res.json(response)
    },
    async completePayment(req,res){
     const {id} = req.params
     const origin = req.headers.origin
     const response = {
        status:"failed",
        error:"could not update payment",
        message:""
     }
     try {
        const order = await Orders.findOne({
            where:{
                order_id:id  
            }
        })
        const user = await UserModel.findOne({
            where:{
                username:order.username
            }
        })
        await Orders.update({
            status:"completed"
        },{
            where:{
                order_id:id
            }
        })
       
        const items = JSON.parse(order.items)
        await NFTModel.update({
            owner:order.username,
        },{
            where:{
             [Op.or]:items.map(item=>({
                nft_id:item.id
             }))
            }
        }
        )
        await Transaction.update({
            state:"completed"
        },{
            where:{
                payment_id:id
            }
        })
        await Transaction.bulkCreate(items.map(item=>{
          return {
            payment_id:v4(),
            state:"completed",
            user:item.seller,
            amount:item.price,
            type:"sale",
            status:"credit"
        }
        }),{validate:true})
        await Notifications.bulkCreate(items.map(item=>{
          return {
            title:"NFT Purchase",
            message:`Someone just purchased your nft: ${item.name} and ${item.price}ETH have been credited to your Account`,
            user:item.seller,
            reciever:item.seller,
            type:"NFT_Purchase",
            message_id:v4()
        }
        }),{validate:true})
        await Notifications.create({
          title:"Order Approved",
          message:`your order ${id} have been approved`,
          user:order.username,
          reciever:order.username,
          type:"order approval",
          message_id:v4()
        })
        console.log(user)
        items.forEach(async(item)=>{
            const user = await UserModel.findOne({
                where:{
                    username:item.seller
                }
            })
            await sendMail({
                from:"Artisfymint",
                to:user.email,
                subject:"NFT Purchase",
                html:getPurcahseHtml(origin,item.name,user.name,item.price)
            })
        })
        await sendMail({
            from:"Artisfymint",
            to:user.email,
            subject:"Order Approval",
            html:getOrderHtml(origin,order.order_id,user.name)
        })

        response.status = "success"
        response.error = null
        response.message = `order ${id} has updated successfully`
     } catch (error) {
        console.log(error)
     }
     res.json(response)
    }
}