const { Model, DataTypes, Transaction } = require("sequelize");
const { sequelize } = require("../config");

class NFTModel extends Model{}
class NFTCollection extends Model{}
class Transactions extends Model{}
class NFTHistory extends Model{}

NFTModel.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    nft_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false,
    },   
    name:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    seller:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    collection:{
        type:DataTypes.TEXT,
    },
    collection_id:{
        type:DataTypes.TEXT,
    },
    meta_data:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    floor_price:{
        type:DataTypes.DECIMAL(11,5),
        allowNull:false,
    }, 
    current_price:{
        type:DataTypes.DECIMAL(11,5),
        allowNull:false,
    },
    owner:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    nft_img:{
        type:DataTypes.TEXT,
        allowNull:false,
    }, 
    attributes:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{tableName:"nft",sequelize})

NFTCollection.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    seller:{
        type:DataTypes.TEXT,
        allowNull:false,
    },   
    name:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    banner_img:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    collection_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{sequelize,tableName:"collections"})

Transactions.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    payment_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },   
    state:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    status:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    amount:{
        type:DataTypes.DECIMAL(11,5),
        allowNull:false,
    },
    user:{
        type:DataTypes.TEXT,
        allowNull:false,
    },  
    type:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{sequelize,tableName:"transactions"})

NFTHistory.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    nft_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },   
    from:{
        type:DataTypes.TEXT,
        allowNull:false,
    }, 
    to:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    amount:{
        type:DataTypes.DECIMAL(11,5),
        allowNull:false,
    },
    user:{
        type:DataTypes.TEXT,
        allowNull:false,
    },  
    type:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{sequelize,tableName:"nft_history"})



module.exports.NFTModel = NFTModel
module.exports.NFTCollection = NFTCollection
module.exports.Transaction = Transactions
module.exports.NFTHistory = NFTHistory