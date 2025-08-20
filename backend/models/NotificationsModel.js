const db = require("../config/config")
const {DataTypes, DATE} = require("sequelize");


const Users = require("./userModel");

const Notifications = db.define("notifications" , {

    notification_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

     user_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model : Users,
            key : 'user_id'
        },
    },
    type:{
        type:DataTypes.ENUM('sms','email'),
        defaultValue: 'sms'
    },
    message:{
        type:DataTypes.STRING,
        allowNull: false
    },
    status:{
         type:DataTypes.ENUM('sent','failed','pending'),
         defaultValue : 'pending'
    }},

    {
        timestamps : true,
        freezeTableName : true
    });

Users.hasMany(Notifications,{foreignKey: "user_id"});
Notifications.belongsTo(Users, {foreignKey: "user_id"});



module.exports = Notifications;