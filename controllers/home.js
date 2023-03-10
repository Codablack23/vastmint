function getHomePage(req,res){
    res.render("index.ejs",{
        title:"Home"
    })
}

function getCollectionsPage(req,res){
    res.render("collections.ejs",{
        title:"Collections",
        page:"collections"
    })
}
function getCollectionPage(req,res){
    res.render("collection.ejs",{
        title:"Collection ",
        page:"collections",
        collection_id:req.params.id
    })
}

function getLoginPage(req,res){
    res.render("login.ejs",{
        title:"Login"
    })
}
function getRegsiterPage(req,res){
    res.render("register.ejs",{
        title:"Register"
    })
}
function getMarketplacePage(req,res){
    res.render("marketplace.ejs",{
        title:"Marketplace",
        page:"marketplace",
    })
}
function getArtPage(req,res){
    res.render("nft.ejs",{
        title:"Marketplace",
        page:"marketplace",
        nft_id:req.params.id
    })
}
function getSellersPage(req,res){
    res.render("seller.ejs",{
        title:"Artist",
        page:"artists",
        seller_id:req.params.id
    })
}

function getSellerPage(req,res){
    res.render("sellers.ejs",{
        title:"Artists",
        page:"artists"
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
    getLoginPage,
    getRegsiterPage
}