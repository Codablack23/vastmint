module.exports = {
    getDashboardHome(req,res){
     res.render("dashboard/index.ejs",{
        title:"Dashboard",
        page:"dashboard"
     })
    },
    getCollectionsPage(req,res){
        res.render("dashboard/collections.ejs",{
            title:"Collection",
            page:"collections"
         })
    },
    getArtPage(req,res){
        res.render("dashboard/art.ejs",{
            title:"Arts",
            page:"art"
         })
    },
}