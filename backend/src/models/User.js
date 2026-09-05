const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Core identity table. Role-specific extra fields (enrollment no., department,
// etc.) live in the linked profile tables below, not here — keeps this table
// small and fast for every login check.
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    mobileNumber: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      // tp_admin = Training & Placement Cell HOD — separate from professor
      // because their permissions (posting placement notices, managing the
      // question bank) are fundamentally different from teaching duties.
      type: DataTypes.ENUM("student", "professor", "parent", "tp_admin"),
      allowNull: false,
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
