const db = require("../config/config")
const {DataTypes} = require("sequelize");


const Users = db.define("users" , {
    user_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userName:{
        type:DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Role:{
        type:DataTypes.ENUM('member', 'treasurer','admin'),
        defaultValue: 'member'
    },
    status:{
        type:DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }


},
{
    timestamps : true,
    freezeTableName : true
});




module.exports = Users;