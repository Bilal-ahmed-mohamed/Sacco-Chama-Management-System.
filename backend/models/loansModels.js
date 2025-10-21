const db = require("../config/config")
const { DataTypes } = require("sequelize");
const Users = require("./userModel");

const Loans = db.define("loans", {
  loan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "user_id"
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  amount_repaid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  amount_remaining: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "repaid", "disbursed", "failed"),
    defaultValue: "pending"
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  issued_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reminder_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null until transaction completes
    unique: true     // Each transaction ID should be unique
  }
},
{
  timestamps: true,
  freezeTableName: true
});

Users.hasMany(Loans, { foreignKey: "user_id" });
Loans.belongsTo(Users, { foreignKey: "user_id" });

module.exports = Loans;
