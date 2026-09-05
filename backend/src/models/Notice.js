const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    // "tp_cell" notices show in the dedicated TP Cell section AND the
    // homepage banner. "general" notices are regular college-wide notices.
    category: {
      type: DataTypes.ENUM("tp_cell", "general"),
      allowNull: false,
      defaultValue: "general",
    },
    postedById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    // Set true once the push-notification job has fired for this notice,
    // so the cron job never sends the same notice twice.
    notificationSent: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "notices", timestamps: true }
);

Notice.belongsTo(User, { as: "postedBy", foreignKey: "postedById" });

module.exports = Notice;
