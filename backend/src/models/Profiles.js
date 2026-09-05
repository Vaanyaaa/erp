const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    enrollmentNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING, allowNull: false },
    program: { type: DataTypes.STRING, allowNull: false },
    semester: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "student_profiles", timestamps: false }
);

const ProfessorProfile = sequelize.define(
  "ProfessorProfile",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    employeeId: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "professor_profiles", timestamps: false }
);

// Same table also backs tp_admin accounts (a TP admin is a staff member too),
// distinguished by the parent User.role, not a separate table.
const ParentProfile = sequelize.define(
  "ParentProfile",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    // Links to the student's enrollment number. Validated against
    // student_profiles at registration time so a parent can't attach to a
    // student who doesn't exist.
    childEnrollmentNo: { type: DataTypes.STRING, allowNull: false },
    relationship: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "parent_profiles", timestamps: false }
);

User.hasOne(StudentProfile, { foreignKey: "userId" });
StudentProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ProfessorProfile, { foreignKey: "userId" });
ProfessorProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ParentProfile, { foreignKey: "userId" });
ParentProfile.belongsTo(User, { foreignKey: "userId" });

module.exports = { StudentProfile, ProfessorProfile, ParentProfile };
