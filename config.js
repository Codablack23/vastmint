const { Sequelize } = require("sequelize");

const dbConfigData ={
    db:process.env.DB,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
} 
module.exports.sequelize = new Sequelize(
    dbConfigData.db,
    dbConfigData.username,
    dbConfigData.password,
    {
      host:dbConfigData.host,
      dialect:"mysql"
    }
)