module.exports.connectDB= async (sequelize)=>{
    const response = {
        status:"pending",
        error:null,
        message:null
    }
    try {
       await  sequelize.sync({alter:true})
       response.status = "success"
    } catch (error) {
       console.log(error) 
       response.status = "failed"
       response.error = error
    }
    return response
}