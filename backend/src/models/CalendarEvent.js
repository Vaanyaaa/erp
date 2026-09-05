const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const CalendarEvent = sequelize.define(
  "CalendarEvent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    eventDate: { type: DataTypes.DATEONLY, allowNull: false },
    eventType: {
      type: DataTypes.ENUM("company_visit", "seminar", "deadline", "exam", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
  { tableName: "calendar_events", timestamps: true }
);

CalendarEvent.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });

module.exports = CalendarEvent;
