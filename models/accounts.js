const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config");

class UserModel extends Model{}
class Notifications extends Model{}
class Orders extends Model{}
class Admin extends Model{}
class Withdrawals extends Model{}

Admin.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    admin_key:{
        type:DataTypes.TEXT,
        allowNull:false,
    }
},{sequelize,tableName:"admin"})

Orders.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    order_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    items:{
        type:DataTypes.TEXT("long"),
        allowNull:false
    },
    amount:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    status:{
        type:DataTypes.TEXT,
        allowNull:false,
        defaultValue:"pending"
    },
    user:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    username:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{sequelize,tableName:"orders"})

Withdrawals.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    withdrawal_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    amount:{
        type:DataTypes.TEXT,
        allowNull:false,
    }, 
    wallet_address:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    status:{
        type:DataTypes.TEXT,
        allowNull:false,
        defaultValue:"pending"
    },
    user:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    username:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{sequelize,tableName:"withdrawals"})

UserModel.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    user_id:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    username:{
        type:DataTypes.TEXT,
        allowNull:false,
    },   
    email:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    name:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    bio:{
        type:DataTypes.TEXT,
    },
    img_profile:{
        type:DataTypes.TEXT,
    },
    banner_img:{
        type:DataTypes.TEXT,
    },
    wallet_address:{
        type:DataTypes.STRING
    }
},{tableName:"users",sequelize})

Notifications.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"unread"
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    }, 
    message:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    reciever:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    user:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    message_id:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},{sequelize,tableName:"notifications"})

module.exports.UserModel = UserModel
module.exports.Notifications = Notifications
module.exports.Orders = Orders
module.exports.Admin = Admin
module.exports.Withdrawals = Withdrawals


