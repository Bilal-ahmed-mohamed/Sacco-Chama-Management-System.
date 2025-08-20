const db = require("../config/config")
const {DataTypes, DATE} = require("sequelize");

const Loans = require(".//loansModels");
const Users = require("./userModel");

const LoanRepayments = db.define("loanRepayments", {

    LoanRepayment_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    loan_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
           references:{
            model : Loans,
            key : 'loan_id'
        },
    },
        user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: "user_id"
        }
    },
        amount:{
        type:DataTypes.DECIMAL(12,2),
        allowNull: false  
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    method:{
        type:DataTypes.ENUM('cash','mpesa','bank'),      
        defaultValue : 'cash'
    }},

    {
        timestamps : true,
        freezeTableName : true
    });

    // associations
Loans.hasMany(LoanRepayments, {foreignKey : "loan_id"});
LoanRepayments.belongsTo(Loans, { foreignKey: "loan_id" });

Users.hasMany(LoanRepayments, { foreignKey: "user_id" });
LoanRepayments.belongsTo(Users, { foreignKey: "user_id" });




module.exports = LoanRepayments;