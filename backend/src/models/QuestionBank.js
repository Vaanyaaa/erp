const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    // Optional: link to an uploaded logo or info sheet later
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "companies", timestamps: true }
);

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Company, key: "id" },
    },
    year: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM("dsa", "aptitude", "hr", "other"),
      allowNull: false,
      defaultValue: "dsa",
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
    },
    topic: { type: DataTypes.STRING, allowNull: true }, // e.g. "Arrays", "DP"
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }, // question text / link
    // If the question came from an uploaded scanned paper, store the file
    // path here so students can also view the original PDF/image.
    sourceFileUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "questions", timestamps: true }
);

Company.hasMany(Question, { foreignKey: "companyId" });
Question.belongsTo(Company, { foreignKey: "companyId" });

module.exports = { Company, Question };
