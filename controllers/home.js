const { UserModel, Orders } = require("../models/accounts");
const {Op} = require("sequelize")
const { NFTModel, NFTCollection,NFTHistory } = require("../models/nfts")


async function getHomePage(req,res){
    let response;
    try {
        const collections = await NFTCollection.findAll()
        const nfts = await NFTModel.findAll()
        response = {
            collections,
            nfts,
            status:"success",
            error:""
        }
    } catch (error) {
       console.log(error)
        response = {
            collections:[],
            nfts:[],
            status:"failed",
            error:"Could not fetch your collection"
        }
    }
    res.render("index.ejs",{
        title:"Home",
        user:req.session.user,
        response
    })
}

async function getCollectionsPage(req,res){
    let response;
    const {query} = req.query
    try {
        const collections = await NFTCollection.findAll()
        const nfts = await NFTModel.findAll()
        response = {
            collections:collections.filter(coll=>coll.name.toLowerCase().includes(query?query.toLowerCase():""))
            .map(collection=>({
                ...collection.dataValues,
                arts:nfts.filter(a=>a.collection_id === collection.collection_id)
            })),
            status:"success",
            error:""
        }
    } catch (error) {
       console.log(error)
        response = {
            collections:[],
            status:"failed",
            error:"Could not fetch your collection"
        }
    }
    res.render("collections.ejs",{
        title:"Collections",
        page:"collections",
        response,
        user:req.session.user
    })
    
}
async function getCollectionPage(req,res){
    let response;
    const {id} = req.params
    try {
        const collectionRes = await NFTCollection.findOne({
           where:{
            collection_id:id
           }
        })
        if(collectionRes){
            const nfts = await NFTModel.findAll({
                where:{
                 collection_id:id
                }
             })
         
             response = {
                 collection:{
                     ...collectionRes.dataValues,
                     nfts
                 },
                 status:"success",
                 error:""
             }
        }else{
            response = {
                collection:null,
                status:"failed",
                status_code:404,
                error:"Collection does not exist"
            }
        }
    } catch (error) {
       console.log(error)
        response = {
            collection:null,
            status:"failed",
            status_code:500,
            error:"Could not fetch your collection"
        }
    }
    console.log(response)
    res.render("collection.ejs",{
        title:"Collection ",
        page:"collections",
        collection_id:req.params.id,
        user:req.session.user,
        response
    })
}


async function getMarketplacePage(req,res){
    let response;
    const {query} = req.query
    try {
        const nfts = await NFTModel.findAll()
        response = {
            nfts:nfts.filter((nft)=>nft.name.toLowerCase().includes(query?query.toLowerCase():"")),
            status:"success",
            error:""
        }
    } catch (error) {
       console.log(error)
        response = {
            nfts:[],
            status:"failed",
            error:"Could not fetch NFTS"
        }
    }
    // console.log(response)

    res.render("marketplace.ejs",{
        title:"Marketplace",
        page:"marketplace",
        response,
        user:req.session.user
    })
}
async function getArtPage(req,res){
        const {id} = req.params
        console.log(id)
        let response;
        try {
           const artRes = await NFTModel.findOne({
               where:{
                 nft_id:id
               }
           }) 
           if(!artRes){
            response = {
                data:null,
                status:"failed",
                status_code:404,
                related:[],
                error:"The resource you are looking for does not exist or have been deleted"
            }
           } else{
            const nft_history = await NFTHistory.findAll({
                where:{
                    nft_id:id
                }
            })
            const allArt = await NFTModel.findAll({
                where:{
                   nft_id:{
                    [Op.ne]:id,
                   },
                   [Op.or]:[
                    {seller:artRes.seller},
                    {collection:artRes.collection}
                   ]
                }
            })
            console.log(nft_history)
            response = {
                nft:artRes,
                status:"success",
                error:"",
                nft_history,
                related:allArt
            }
           }
          
        } catch (error) {
           console.log(error)
           response = {
               data:null,
               status:"failed",
               status_code:500,
               related:[],
               error:"Could not fetch NFTS due to some server error"
           }
        }
    console.log(response)
    res.render("nft.ejs",{
        title:"Marketplace",
        page:"marketplace",
        nft_id:req.params.id,
        response,
        user:req.session.user
    })
}
async function getSellersPage(req,res){
    let response;
    const {id} = req.params

    try {
        const seller = await UserModel.findOne({
            where:{
                username:id
            },
            attributes:{
                exclude:["password"]
            }
        })
        if(seller){
            const collections = await NFTCollection.findAll({
                seller:seller.username
            })
            const nfts = await NFTModel.findAll({
                where:{
                    seller:seller.username
                }
            })
            response = {
                seller:seller?{
                    ...seller.dataValues,
                    nfts,
                    collections
                }:null,
                status:"success",
                error:""
            }
        }else{
            response = {
                seller:null,
                status:"failed",
                status_code:"404",
                error:"The seller you are looking for might not been moved or does not exist"
            } 
        }
    } catch (error) {
        console.log(error)
        response = {
            seller:null,
            status:"failed",
            status_code:"500",
            error:"Could not fetch NFTS due to some server error"
        }
    }
    console.log(response)
    res.render("seller.ejs",{
        response,
        title:"Artist",
        page:"artists",
        user:req.session.user
    })
}

async function getSellerPage(req,res){
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
            error:"Could not fetch NFTS"
        }
    }
    // console.log(response)
    res.render("sellers.ejs",{
        title:"Artists",
        page:"artists",
        response,
        user:req.session.user
    })
    
}

async function getCartPage(req,res){
    res.render("cart.ejs",{
        title:"Cart",
        page:"cart",
        response:null,
        user:req.session.user
    })
}
async function getOrdersPage(req,res){
    let response;
    const {username} = req.session.user
    try {
        const orders = await Orders.findAll({
            where:{
                username
            }
        })
        response = {
            orders,
            status:"success",
            error:""
        }
    } catch (error) {
       console.log(error)
        response = {
            sellers:[],
            status:"failed",
            error:"Could not get Orders"
        }
    }
    res.render("orders.ejs",{
        title:"Orders",
        page:"order",
        response,
        user:req.session.user
    })
}
module.exports = {
    getHomePage,
    getCollectionsPage,
    getCollectionPage,
    getMarketplacePage,
    getArtPage,
    getSellersPage,
    getSellerPage,
    getCartPage,
    getOrdersPage
}