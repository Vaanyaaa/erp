const sequelize = require("../config/database");
const User = require("./User");
const { StudentProfile, ProfessorProfile, ParentProfile } = require("./Profiles");
const Notice = require("./Notice");
const { Company, Question } = require("./QuestionBank");
const CalendarEvent = require("./CalendarEvent");

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
};
