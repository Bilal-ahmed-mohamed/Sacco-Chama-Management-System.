const db = require("../config/config")
const {DataTypes} = require("sequelize");

const Users = require("./userModel");

const Contributions = db.define("contributions" , {
    contributions_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement : true
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
    method:{
        type:DataTypes.ENUM('cash','mpesa','bank'),
        defaultValue: 'cash'
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },

},
{
    timestamps : true,
    freezeTableName : true
});

// associations
Users.hasMany(Contributions, {foreignKey: "user_id"});
Contributions.belongsTo(Users, {foreignKey : 'user_id'});



module.exports = Contributions;