const db = require("../config/config")
const {DataTypes, DATE} = require("sequelize");

const Settings = db.define("settings" , {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    min_contribution:{
        type:DataTypes.DECIMAL(12,2),
        allowNull: false  
    },
    loan_limit:{
         type:DataTypes.DECIMAL(5,2),
        allowNull: false  
    }},

    {
        timestamps : true,
        freezeTableName : true
    });



module.exports = Settings;