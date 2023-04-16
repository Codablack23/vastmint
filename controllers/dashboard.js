const {NFTModel, NFTCollection,Transaction, NFTHistory} = require("../models/nfts")
const {UserModel,Notifications} = require("../models/accounts")
const bcrypt = require("bcrypt")
const { v4 } = require("uuid")
const { calcBalance,calcEarnings } = require("../utils/getBalance")
const { MintFee } = require("../models/init")

module.exports = {
    async getDashboardHome(req,res){
     const {user} = req.session
     let response;
     try {
        const transactions = await Transaction.findAll({
            where:{
              user:user.username
            }
        }) 
        const artRes = await NFTModel.findAll({
            where:{
              seller:user.username
            }
        })   
        const collectionRes = await NFTCollection.findAll({
            where:{
              seller:user.username
            }
        })
        response = {
            data:{
                listing:artRes,
                collections:collectionRes.map(coll=>({
                    ...coll.dataValues,
                    arts:artRes.filter(a=>a.collection_id === coll.collection_id)
                })),
                balance:calcBalance(transactions),
                earnings:calcEarnings(transactions)
            },
            status:"success",
            error:""
        }
     } catch (error) {
        console.log(error)
        response = {
            data:null,
            status:"failed",
            status_code:"500",
            error:"Could not fetch NFTS due to some server error"
        }
     }
     console.log(response)
     res.render("dashboard/index.ejs",{
        title:"Dashboard",
        page:"dashboard",
        response
     })
    },
    async getCollectionsPage(req,res){
        const {user} = req.session
        let response;
        try {
           
           const artRes = await NFTModel.findAll({
               where:{
                 seller:user.username
               }
           })   
           const collectionRes = await NFTCollection.findAll({
               where:{
                 seller:user.username
               }
           })
           response = {
               data:{
                   collections:collectionRes.map(coll=>({
                       ...coll.dataValues,
                       arts:artRes.filter(a=>a.collection_id === coll.collection_id),
                       total_price:parseFloat(artRes
                        .filter(a=>a.collection_id === coll.collection_id)
                        .reduce((a,b)=>{
                         console.log(b.current_price)
                         return a+parseFloat(b.current_price)
                        },0)).toFixed(3)
                   }))
               },
               _status: "success",
               get status() {
                   return this._status
               },
               set status(value) {
                   this._status = value
               },
               error:""
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not fetch NFTS due to some server error"
           }
        }
        console.log(response)
        res.render("dashboard/collections.ejs",{
            title:"Collection",
            page:"collections",
            response
         })
    },
    async getCollectionPage(req,res){
        const {id} = req.params
        const {user} = req.session
        let response;
        try {
            const collectionRes = await NFTCollection.findOne({
                where:{
                  seller:user.username,
                  collection_id:id
                }
            })
           if(collectionRes){
            const artRes = await NFTModel.findAll({
                where:{
                  seller:user.username
                }
            })   
            const arts=artRes.filter(art=>art.collection_id===collectionRes.collection_id)
            const available=artRes.filter(art=>!art.collection_id)
            response = {
                data:{
                    collection:{
                        ...collectionRes.dataValues,
                        arts,
                        available,
                        total_price:parseFloat(arts.reduce((a,b)=>a+parseFloat(b.current_price),0)).toFixed(3)
                    }
                },
                status:"success",
                error:""
            }
           }else{
            response = {
                data:null,
                status:"failed",
                status_code:404,
                error:"The collection you are looking for does not exist or have been moved"
            }
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not fetch collections due to some server error"
           }
        }
        console.log(response)
        res.render("dashboard/collection.ejs",{
            title:"Collection",
            page:"collections",
            response
         })
    },
    async getArtPage(req,res){
        const {user} = req.session
        let response;
        try {
           
           const artRes = await NFTModel.findAll({
               where:{
                 seller:user.username
               }
           })   
           response = {
               data:{
                   listing:artRes,
               },
               status:"success",
               error:""
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not fetch NFTS due to some server error"
           }
        }
        console.log(response)
        res.render("dashboard/art.ejs",{
            title:"Arts",
            page:"nfts",
            response
         })
    },  
    async getNotificationsPage(req,res){
        const {user} = req.session
        let response;
        try {
           
           const notifications = await Notifications.findAll({
               where:{
                 reciever:user.username
               }
           })   
           response = {
               notifications,
               status:"success",
               error:""
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not fetch NFTS due to some server error"
           }
        }
        res.render("dashboard/notifications.ejs",{
            title:"notifications",
            page:"notifications",
            response
         })
    },
    async getWalletPage(req,res){
        const {user} = req.session
        let response;
        try {
           
           const transactions = await Transaction.findAll({
               where:{
                 user:user.username
               }
           })   
           response = {
               data:{
                   transactions,
                   balance:calcBalance(transactions),
                   earnings:calcEarnings(transactions)
               },
               status:"success",
               error:""
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not fetch NFTS due to some server error"
           }
        }
        console.log(response)
        res.render("dashboard/wallet.ejs",{
            title:"wallet",
            page:"wallet",
            response
         })
    }, 
    async getMintPage(req,res){
        let mint_fee = process.env.MINT_FEE
        try {
            const mintFee = await MintFee.findAll()
            mint_fee = mintFee[0].mint_fee
        } catch (error) {
            console.log(mint_fee)
        }
        res.render("dashboard/mint.ejs",{
            title:"Mint NFT",
            page:"mint-nft",
            mint_fee
         })
    },  
    getWithdrawPage(req,res){
        res.render("dashboard/withdraw.ejs",{
            title:"Withdraw",
            page:"withdraw",
            response:null
         })
    },  
    async processWithdraw(req,res){
        const {amount} = req.body
        const{username} = req.session.user
        let response ={
            status:"failed",
            message:"",
            error:"pending process",
            data:null 
        };
        try {
            const payment_id = v4()
            await Transaction.create({
                payment_id,
                state:"pending",
                user:username,
                amount,
                type:"withdraw",
                status:"DEBIT"
            })
            response = {
                status:"success",
                data:{
                payment_id
                },
                error:"",
                message:"Your Withdraw request was successful please stand by while we process your info you can contact support for more info"
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
    async getCreateCollectionPage(req,res){
        let mint_fee = process.env.MINT_FEE
        try {
            const mintFee = await MintFee.findAll()
            mint_fee = mintFee[0].mint_fee
        } catch (error) {
            console.log(mint_fee)
        }
        res.render("dashboard/create_collection.ejs",{
            title:"Create Collection",
            page:"collections",
            mint_fee:mint_fee * 4,
         })
    },  
    async getFundPage(req,res){
        res.render("dashboard/fund.ejs",{
            title:"Fund Account",
            page:"wallet"
         })
    },
    async fundAccount(req,res){
        const {amount,type,status} = req.body
        console.log(req.body)
        const {username} = req.session.user
        let response = {
            status:"loading",
            message:"loading",
            error:"loading",
            data:null
        }
        try {
            const payment_id = v4()
            await Transaction.create({
                payment_id,
                state:"pending",
                user:username,
                amount,
                type,
                status
            })
            response = {
               status:"success",
               data:{
                payment_id
               },
               error:"",
               message:"Payment has been started successfully and is now pending"
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
    async createCollection(req,res){
       const {name,banner_img} = req.body
       const {username,name:user,email} = req.session.user
       const origin = req.headers.origin

       let response = {
            data:null,
            status:"failed",
            status_code:500,
            error:"Could not fetch NFTS due to some server error"
        }
  
        try {
            let collection_id = v4()
            const mintfee = (await MintFee.findAll())[0].mint_fee
            await NFTCollection.create({
                seller:username,
                banner_img,
                collection_id,
                name,
            })
            response.status = "success",
            response.error=null
            response.status_code=200
            response.message = "collection created successfully"
            response.data = {
                collection_id
            }
            await Transaction.create({
                payment_id:v4(),
                state:"completed",
                user:username,
                amount:mintfee,
                type:"mint",
                status:"DEBIT"
            })
            await Notifications.create({
                title:"Collection Created successful",
                type:"mint",
                message:"You have Successfully minted a nft",
                reciever:username,
                user:user,
                message_id:v4()
            })
            await sendMail({
                from:"Artisfy",
                to:email,
                subject:"Mint Successful",
                html:getMintEmailHtml(origin,nft_id,user)
            })
        } catch (error) {
            console.log(error)
        }
        res.json(response)
        
    },
    async createTransaction(req,res){

    },
    async getSingleArtPage(req,res){
        const {user} = req.session
        const {id} = req.params
        let response;
        try {
           
           const artRes = await NFTModel.findOne({
               where:{
                 seller:user.username,
                 nft_id:id
               }
           }) 
           if(!artRes){
            response = {
                data:null,
                status:"failed",
                status_code:404,
                error:"The resource you are looking for does not exist or have been deleted"
            }
           } else{
            const nft_history = await NFTHistory.findAll({
                where:{
                    nft_id:id
                }
            })
            console.log(nft_history)
            response = {
                nft:artRes,
                status:"success",
                error:"",
                nft_history
            }
           }
          
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:500,
               error:"Could not fetch NFTS due to some server error"
           }
        }
        res.render("dashboard/single_art.ejs",{
            title:"Mint NFT",
            page:"nfts",
            art_id:req.params.id,
            response
         })
    }, 
    async getProfilePage(req,res){
        const {username} = req.session.user
        let response;
        try {
           
           const user = await UserModel.findOne({
               where:{
                 username
               },
               attributes:{
                exclude:["password"]
               }
           })   
           response = {
               user,
               status:"success",
               error:""
           }
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:"500",
               error:"Could not your profile due to some server error"
           }
        }
        console.log(response)
        res.render("dashboard/profile.ejs",{
            title:"Profile",
            page:"profile",
            response
         })
    }, 
    async getSettingsPage(req,res){
        const {username} = req.session.user
        let user = null;
        try{
            user = await UserModel.findOne({
                where:{
                    username
                }
            })
        }catch(err){
           console.log(err)
        }
        res.render("dashboard/settings.ejs",{
            title:"Settings",
            page:"settings",
            response:null,
            user
         })
    },
    async updateNFT(req,res){
        let response;
        console.log(req)
        const {username} = req.session.user
        const {id} = req.params
        const {nft_id} = req.body
        console.log({
            nft_id,
            id
        })
        try{
            const collection = await NFTCollection.findOne({
                where:{
                    collection_id:id ,
                }
            })
           if(collection){
            await NFTModel.update({
                collection_id:id,
                collection:collection.name
              },{
                  where:{
                   nft_id,
                   seller:username
                  }
              })
              response = {
                status:"success",
                error:""
            }
           }else{
            response = {
                data:null,
                status:"failed",
                status_code:"500",
                error:"Collection does not exist"
               }
           }
        }catch(err){
           console.log(err)
           response = {
            data:null,
            status:"failed",
            status_code:"500",
            error:"Could not add nft to collection due to some server error"
           }
        }
        res.json(response)
    },
    async changePassword(req,res){
      let user;
      const {username} = req.session.user
      const {password,new_password} = req.body
      console.log(req.body)
      let response={
        status:"failed",
        message:"",
        error:"pending",
        err:"pending"
      }
      try {
        user = await UserModel.findOne({
            username
        })
        const isMatched = await bcrypt.compare(password,user.password)
        if(!isMatched){
            response.status = "failed"
            response.error = "Your inputted password does not match your current password"
            response.err = "Your inputted password does not match your current password"
        }else{
           const salt = await bcrypt.genSalt(10)
           const encPassword = await bcrypt.hash(new_password,salt)

           await UserModel.update({
             password:encPassword
           },{
            where:{
                username
            }
           })
           response.status = "success"
           response.error = ""
           response.err = ""
           response.message = "Password changed successfully"
        }
      } catch (error) {
        console.log(error)
        response.status = "failed"
        response.error = "sorry could not connect to our servers at the moment try again later"
        response.err = "sorry could not connect to our servers at the moment try again later"
      }
      res.render("dashboard/settings.ejs",{
        title:"Settings",
        page:"settings",
        response,
        user
     })
    },
    async updateProfile(req,res){
      const {username} = req.session.user
      const {name,wallet_address,bio,email} = req.body
      let user;
      console.log(req.body)
      let response={
        status:"failed",
        message:"",
        error:"pending",
        err:"pending"
      }
      try {
           await UserModel.update({
            name,
            wallet_address,
            bio,
            email
           },{
            where:{
                username
            }
           })
           req.session.user = {
            ...req.session.user,
            email
           }
           user = await UserModel.findOne({
            where:{
                username
            }
           })
           response.status = "success"
           response.error = ""
           response.err = ""
           response.message = "Profile updated successfully"
      } catch (error) {
        console.log(error)
        response.status = "failed"
        response.error = "sorry could not connect to our servers at the moment try again later"
        response.err = "sorry could not connect to our servers at the moment try again later"
      }
      console.log(user)
      res.render("dashboard/settings.ejs",{
        title:"Settings",
        page:"settings",
        response,
        user
     })
    }
}