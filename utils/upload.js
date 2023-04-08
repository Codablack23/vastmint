require('dotenv').config()

const cloudinary = require('cloudinary').v2

const keys = {
    public:process.env.CLOUDINARY_PUBLIC,
    secret:process.env.CLOUDINARY_SECRET,
    name:process.env.CLOUDINARY_NAME,
}

cloudinary.config({
    cloud_name:keys.name,
    api_key:keys.public,
    api_secret:keys.secret,
})
module.exports.uploadToCloudinary = async(file)=>{
    console.log(file)
    const res = {
        status:"pending",
        url:null,
        error:"could not upload file"
    } 
    try {
    const img = await cloudinary.uploader.upload(file.tempFilePath,(img)=>img)
    console.log(img)
    res.status = "success"
    res.url = img.secure_url
    res.error = null
  } catch (error) {

    console.log(error)
    res.status = "failed"
    res.error = error
  }
   console.log(res)
  return res
}