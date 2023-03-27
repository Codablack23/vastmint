const {Model,DataTypes} = require("sequelize")
const { sequelize } = require("../config")
class MintFee extends Model{}

MintFee.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    mint_fee:{
      type:DataTypes.DECIMAL(11,5),
      allowNull:false
    }
},{sequelize,tableName:"mint_fee"})


module.exports.MintFee = MintFee