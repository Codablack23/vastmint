require('dotenv').config()
const ftp = require('basic-ftp');
const cloudinary = require('cloudinary').v2

const uploadConfig = {
    host: 'ftp.artsealtd.com',
    username: 'artseaftp@artsealtd.com',
    password: 'artsea@ftppassword',
    secure : true
};


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
module.exports.uploadToFTPServer = async(file)=>{
    const client = new ftp.Client()
    client.ftp.verbose = true
    const res = {
        status:"pending",
        url:null,
        error:"could not upload file"
    } 
    try {
        await client.access(uploadConfig)
        console.log(await client.list())
        await client.uploadFrom(file.tempFilePath, `/public_html/${file.name}`)
        res.status = "success"
        res.url = `https://artsealtd.com/${file.name}`
        res.error = null
        // await client.downloadTo("README_COPY.md", "README_FTP.md")
    }
    catch(err) {
        console.log(err)
        res.status = "failed"
        res.error = error
    }
    client.close()
    
  return res
}