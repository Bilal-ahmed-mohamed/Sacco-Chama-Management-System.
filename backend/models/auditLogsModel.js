const db = require("../config/config")
const {DataTypes, DATE} = require("sequelize");


const Users = require("./userModel");


const Auditlogs = db.define("auditLogs" , {

    auditLog_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model : Users,
            key : 'user_id'
        },
    },
    action:{
        type:DataTypes.STRING,
        allowNull:false
    }},


    {
        timestamps : true,
        freezeTableName : true
    });

// associations 
Users.hasMany(Auditlogs, {foreignKey: "user_id"});
Auditlogs.belongsTo(Users,{foreignKey: "user_id"});



module.exports = Auditlogs;