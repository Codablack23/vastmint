module.exports.authenticateUsers=(req,res,next)=>{
   if(!req.session.user){
    return res.redirect("/accounts/")
   }
   next()
}
module.exports.authenticateAdmin=(req,res,next)=>{
   if(!req.session.admin){
    return res.redirect("/admin/login")
   }
   next()
}