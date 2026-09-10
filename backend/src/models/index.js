const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/* ─────────────────────────────────────────────
   USERS + ROLE PROFILES
   ───────────────────────────────────────────── */

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mobileNumber: { type: DataTypes.STRING },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      // tp_admin is a distinct role, not "professor with extra permission" —
      // a TP Cell HOD's job is different from teaching duties.
      type: DataTypes.ENUM("student", "professor", "parent", "tp_admin"),
      allowNull: false,
      defaultValue: "student",
    },
    lastLoginAt: { type: DataTypes.DATE },
  },
  { tableName: "users" }
);

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enrollmentNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING },
    program: { type: DataTypes.STRING },
    semester: { type: DataTypes.STRING },
  },
  { tableName: "student_profiles" }
);

const ProfessorProfile = sequelize.define(
  "ProfessorProfile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
  },
  { tableName: "professor_profiles" }
);

const ParentProfile = sequelize.define(
  "ParentProfile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    childEnrollmentNo: { type: DataTypes.STRING, allowNull: false },
    relationship: { type: DataTypes.STRING },
  },
  { tableName: "parent_profiles" }
);

/* ─────────────────────────────────────────────
   NOTICES  (general + TP Cell)
   ───────────────────────────────────────────── */

const Notice = sequelize.define(
  "Notice",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    category: {
      type: DataTypes.ENUM("general", "tp_cell", "exam", "fees", "emergency"),
      defaultValue: "general",
    },
    priority: {
      type: DataTypes.ENUM("normal", "high"),
      defaultValue: "normal",
    },
    attachmentUrl: { type: DataTypes.STRING },
    // Optional. When set, the notice also appears on the month calendar —
    // this is how "mid-sem starts on the 12th" reaches the calendar without
    // anyone having to parse dates out of the notice text.
    eventDate: { type: DataTypes.DATEONLY },
  },
  { tableName: "notices" }
);

/* ─────────────────────────────────────────────
   TP CELL: COMPANIES + QUESTION BANK
   ───────────────────────────────────────────── */

const Company = sequelize.define(
  "Company",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    sector: { type: DataTypes.STRING },
    ctcRange: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
  },
  { tableName: "companies" }
);

const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM("dsa", "aptitude", "leetcode", "hr", "technical"),
      defaultValue: "dsa",
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      defaultValue: "medium",
    },
    topic: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    answer: { type: DataTypes.TEXT },
    sourceUrl: { type: DataTypes.STRING },
  },
  { tableName: "questions" }
);

/* ─────────────────────────────────────────────
   PLACEMENT / EVENT CALENDAR
   ───────────────────────────────────────────── */

const CalendarEvent = sequelize.define(
  "CalendarEvent",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    eventDate: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.STRING },
    venue: { type: DataTypes.STRING },
    type: {
      type: DataTypes.ENUM("company_visit", "seminar", "deadline", "exam"),
      defaultValue: "company_visit",
    },
    notes: { type: DataTypes.TEXT },
  },
  { tableName: "calendar_events" }
);

/* ─────────────────────────────────────────────
   ACADEMICS: ATTENDANCE, FEES, COURSES, TIMETABLE
   ───────────────────────────────────────────── */

const Course = sequelize.define(
  "Course",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    credits: { type: DataTypes.INTEGER, defaultValue: 4 },
    department: { type: DataTypes.STRING },
    semester: { type: DataTypes.STRING },
  },
  { tableName: "courses" }
);

const Attendance = sequelize.define(
  "Attendance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("present", "absent", "leave"),
      defaultValue: "present",
    },
  },
  { tableName: "attendance" }
);

const Fee = sequelize.define(
  "Fee",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    amountDue: { type: DataTypes.FLOAT, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM("pending", "paid", "overdue"),
      defaultValue: "pending",
    },
    receiptNo: { type: DataTypes.STRING },
  },
  { tableName: "fees" }
);

const TimetableSlot = sequelize.define(
  "TimetableSlot",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dayOfWeek: { type: DataTypes.INTEGER, allowNull: false }, // 0 = Sunday
    startTime: { type: DataTypes.STRING, allowNull: false },
    endTime: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING, allowNull: false },
    room: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    semester: { type: DataTypes.STRING },
  },
  { tableName: "timetable_slots" }
);

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    action: { type: DataTypes.STRING, allowNull: false },
    detail: { type: DataTypes.STRING },
  },
  { tableName: "activity_logs" }
);

const Material = sequelize.define(
  "Material",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    kind: {
      type: DataTypes.ENUM("assignment", "note"),
      allowNull: false,
      defaultValue: "assignment",
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    subject: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    semester: { type: DataTypes.STRING },
    dueDate: { type: DataTypes.DATEONLY },
    originalName: { type: DataTypes.STRING },
    storedPath: { type: DataTypes.STRING },
    mimeType: { type: DataTypes.STRING },
    sizeBytes: { type: DataTypes.INTEGER },
  },
  { tableName: "materials" }
);

const Document = sequelize.define(
  "Document",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    originalName: { type: DataTypes.STRING },
    storedPath: { type: DataTypes.STRING },
    extractedText: { type: DataTypes.TEXT },
    confidence: { type: DataTypes.FLOAT },
    kind: { type: DataTypes.STRING, defaultValue: "scan" },
  },
  { tableName: "documents" }
);

/* ─────────────────────────────────────────────
   ASSOCIATIONS
   ───────────────────────────────────────────── */

User.hasOne(StudentProfile, { foreignKey: "userId", as: "studentProfile", onDelete: "CASCADE" });
StudentProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ProfessorProfile, { foreignKey: "userId", as: "professorProfile", onDelete: "CASCADE" });
ProfessorProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ParentProfile, { foreignKey: "userId", as: "parentProfile", onDelete: "CASCADE" });
ParentProfile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notice, { foreignKey: "postedById", as: "notices" });
Notice.belongsTo(User, { foreignKey: "postedById", as: "postedBy" });

Company.hasMany(Question, { foreignKey: "companyId", as: "questions", onDelete: "CASCADE" });
Question.belongsTo(Company, { foreignKey: "companyId", as: "company" });

User.hasMany(Attendance, { foreignKey: "studentId", as: "attendance" });
Attendance.belongsTo(User, { foreignKey: "studentId", as: "student" });
Course.hasMany(Attendance, { foreignKey: "courseId" });
Attendance.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Fee, { foreignKey: "studentId", as: "fees" });
Fee.belongsTo(User, { foreignKey: "studentId", as: "student" });

User.hasMany(ActivityLog, { foreignKey: "userId", as: "activity" });
ActivityLog.belongsTo(User, { foreignKey: "userId" });

// A slot belongs to the professor who teaches it, so a professor's timetable
// is "the classes I teach" rather than "the classes my department runs".
User.hasMany(TimetableSlot, { foreignKey: "professorId", as: "teachingSlots" });
TimetableSlot.belongsTo(User, { foreignKey: "professorId", as: "professor" });

User.hasMany(Material, { foreignKey: "uploadedById", as: "materials" });
Material.belongsTo(User, { foreignKey: "uploadedById", as: "uploadedBy" });

User.hasMany(Document, { foreignKey: "uploadedById", as: "documents" });
Document.belongsTo(User, { foreignKey: "uploadedById", as: "uploadedBy" });

module.exports = {
  sequelize,
  User,
  StudentProfile,
  ProfessorProfile,
  ParentProfile,
  Notice,
  Company,
  Question,
  CalendarEvent,
  Course,
  Attendance,
  Fee,
  TimetableSlot,
  ActivityLog,
  Document,
  Material,
};
