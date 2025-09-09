const db = require("../config/config")
const {DataTypes} = require("sequelize");

const Users = require("./userModel");

const Loans = db.define("loans" , {
    loan_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model : Users,
            key : 'user_id'
        },
    },
    amount:{
        type:DataTypes.DECIMAL(12,2),
        allowNull: false   
    },
    status:{
        type:DataTypes.ENUM('pending','approved','rejected','repaid'),
        defaultValue: 'pending'
    },
    reason:{
        type:DataTypes.STRING,
        allowNull:false
    },
    issued_date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    due_date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },

},
{
    timestamps : true,
    freezeTableName : true
});

Users.hasMany(Loans, {foreignKey: "user_id"})
Loans.belongsTo(Users, {foreignKey : 'user_id'});



module.exports = Loans;
