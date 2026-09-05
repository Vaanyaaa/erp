require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  StudentProfile,
  ProfessorProfile,
  ParentProfile,
  Notice,
  Company,
  Question,
  CalendarEvent,
} = require("../models");

async function seed() {
  await sequelize.sync({ alter: true });

  const passwordHash = await bcrypt.hash("password123", 10);

  // --- Users ---
  const tpAdmin = await User.create({
    fullName: "Dr. Ramesh Kumar",
    email: "tpadmin@edusphere.edu",
    mobileNumber: "+919999900001",
    passwordHash,
    role: "tp_admin",
  });
  await ProfessorProfile.create({
    userId: tpAdmin.id,
    employeeId: "TP-001",
    department: "Training & Placement",
    designation: "TP Cell Head",
  });

  const student = await User.create({
    fullName: "Aarav Sharma",
    email: "aarav@edusphere.edu",
    mobileNumber: "+919999900002",
    passwordHash,
    role: "student",
  });
  await StudentProfile.create({
    userId: student.id,
    enrollmentNo: "EN2026-001",
    department: "Computer Science",
    program: "B.Tech CS",
    semester: "Semester VII",
  });

  const parent = await User.create({
    fullName: "Sunita Sharma",
    email: "sunita@example.com",
    mobileNumber: "+919999900003",
    passwordHash,
    role: "parent",
  });
  await ParentProfile.create({
    userId: parent.id,
    childEnrollmentNo: "EN2026-001",
    relationship: "Mother",
  });

  // --- Companies + Questions ---
  const google = await Company.create({ name: "Google", description: "Product-based, product & infra roles" });
  const tcs = await Company.create({ name: "TCS", description: "Mass recruiter, service-based" });

  await Question.bulkCreate([
    {
      companyId: google.id,
      year: 2025,
      type: "dsa",
      difficulty: "medium",
      topic: "Arrays",
      title: "Two Sum variant",
      content: "Given an array, find all pairs summing to a target value.",
    },
    {
      companyId: google.id,
      year: 2025,
      type: "dsa",
      difficulty: "hard",
      topic: "Dynamic Programming",
      title: "Longest increasing subsequence",
      content: "Find the length of the longest strictly increasing subsequence.",
    },
    {
      companyId: tcs.id,
      year: 2025,
      type: "aptitude",
      difficulty: "easy",
      topic: "Percentages",
      title: "Basic percentage problem",
      content: "If a number is increased by 20% and then decreased by 20%, find the net change.",
    },
  ]);

  // --- Notices ---
  await Notice.create({
    title: "Google On-Campus Drive — Registration Open",
    body: "Eligible CS/IT students (7th sem, CGPA 7.5+) can register by Friday. Venue: Seminar Hall.",
    category: "tp_cell",
    postedById: tpAdmin.id,
  });

  // --- Calendar ---
  const today = new Date();
  await CalendarEvent.create({
    title: "Google Pre-Placement Talk",
    eventDate: today.toISOString().slice(0, 10),
    eventType: "company_visit",
    description: "Auditorium, 10 AM. Attendance mandatory for registered students.",
    createdById: tpAdmin.id,
  });

  console.log("✅ Seed complete.");
  console.log("   Login as TP Admin: tpadmin@edusphere.edu / password123");
  console.log("   Login as Student:  aarav@edusphere.edu / password123");
  console.log("   Login as Parent:   sunita@example.com / password123");

  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
