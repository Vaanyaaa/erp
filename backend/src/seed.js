require("dotenv").config();
const bcrypt = require("bcryptjs");
const { toISODate, addDays } = require("./utils/dates");
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
  Course,
  Attendance,
  Fee,
  TimetableSlot,
  ActivityLog,
  Material,
} = require("./models");

const PASSWORD = "Password@123";

// Local formatting, not toISOString — see src/utils/dates.js for why.
function dateOffset(days) {
  return toISODate(addDays(new Date(), days));
}

async function seed() {
  await sequelize.sync({ force: true });
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  /* Users */
  const student = await User.create({
    fullName: "Aarav Sharma",
    email: "aarav@acadex.edu",
    mobileNumber: "9876543210",
    passwordHash,
    role: "student",
  });
  await StudentProfile.create({
    userId: student.id,
    enrollmentNo: "CS2023045",
    department: "Computer Science",
    program: "B.Tech",
    semester: "6",
  });

  const professor = await User.create({
    fullName: "Dr. Meera Iyer",
    email: "meera@acadex.edu",
    mobileNumber: "9876500011",
    passwordHash,
    role: "professor",
  });
  await ProfessorProfile.create({
    userId: professor.id,
    employeeId: "EMP2011",
    department: "Computer Science",
    designation: "Associate Professor",
  });

  const tpAdmin = await User.create({
    fullName: "Rajesh Verma",
    email: "tpcell@acadex.edu",
    mobileNumber: "9876500022",
    passwordHash,
    role: "tp_admin",
  });
  await ProfessorProfile.create({
    userId: tpAdmin.id,
    employeeId: "TPC001",
    department: "Training & Placement",
    designation: "TP Cell Head",
  });

  const parent = await User.create({
    fullName: "Sunita Sharma",
    email: "sunita@acadex.edu",
    mobileNumber: "9876500033",
    passwordHash,
    role: "parent",
  });
  await ParentProfile.create({
    userId: parent.id,
    childEnrollmentNo: "CS2023045",
    relationship: "Mother",
  });

  /* Courses + timetable */
  const courses = await Course.bulkCreate([
    { code: "CS601", name: "Distributed Systems", credits: 4, department: "Computer Science", semester: "6" },
    { code: "CS602", name: "Machine Learning", credits: 4, department: "Computer Science", semester: "6" },
    { code: "CS603", name: "Compiler Design", credits: 3, department: "Computer Science", semester: "6" },
    { code: "CS604", name: "Cloud Computing", credits: 3, department: "Computer Science", semester: "6" },
  ]);

  const slots = [];
  const plan = [
    ["09:00", "10:00", "Distributed Systems", "LT-3"],
    ["10:15", "11:15", "Machine Learning", "LT-1"],
    ["11:30", "12:30", "Compiler Design", "LT-2"],
    ["14:00", "15:30", "Cloud Computing Lab", "Lab-4"],
  ];
  for (let day = 1; day <= 5; day++) {
    plan.forEach(([startTime, endTime, subject, room]) => {
      slots.push({
        dayOfWeek: day,
        startTime,
        endTime,
        subject,
        room,
        department: "Computer Science",
        semester: "6",
        // Dr. Iyer teaches the ML and Compiler slots — her timetable shows
        // only these, while students see the whole department grid.
        professorId: ["Machine Learning", "Compiler Design"].includes(subject)
          ? professor.id
          : null,
      });
    });
  }
  await TimetableSlot.bulkCreate(slots);

  /* Attendance — 8 weeks of records */
  const attendance = [];
  for (let i = 0; i < 56; i++) {
    const course = courses[i % courses.length];
    attendance.push({
      studentId: student.id,
      courseId: course.id,
      date: dateOffset(-i),
      status: i % 9 === 0 ? "absent" : "present",
    });
  }
  await Attendance.bulkCreate(attendance);

  /* Fees */
  await Fee.bulkCreate([
    {
      studentId: student.id,
      title: "Semester 6 Tuition Fee",
      amountDue: 62000,
      dueDate: dateOffset(-30),
      status: "paid",
      receiptNo: "RCP-2026-0451",
    },
    {
      studentId: student.id,
      title: "Examination Fee",
      amountDue: 3500,
      dueDate: dateOffset(12),
      status: "pending",
    },
    {
      studentId: student.id,
      title: "Library & Lab Charges",
      amountDue: 4800,
      dueDate: dateOffset(-4),
      status: "overdue",
    },
  ]);

  /* Notices */
  await Notice.bulkCreate([
    {
      title: "Infosys campus drive — registration open",
      body:
        "The Training and Placement Cell would like to inform all students that registration for the Infosys campus drive is now open on the portal.\n\nStudents are advised to check the placement calendar for exact timings and to keep their documents ready.",
      category: "tp_cell",
      priority: "high",
      postedById: tpAdmin.id,
    },
    {
      title: "TCS NQT aptitude pattern updated for 2026",
      body:
        "The revised TCS NQT pattern adds a reasoning section. Practice sets for the new pattern are available in the TP Cell question bank.",
      category: "tp_cell",
      postedById: tpAdmin.id,
    },
    {
      eventDate: dateOffset(5),
      title: "Mid-semester examination schedule released",
      body:
        "The Examination Committee would like to inform all students that the mid-semester timetable is now on the notice board. Report fifteen minutes before each paper with a valid ID card.",
      category: "exam",
      postedById: professor.id,
    },
    {
      eventDate: dateOffset(3),
      title: "Library and lab charges due this week",
      body:
        "The Accounts Office would like to inform all students and parents that library and lab charges are due. Payments made after the due date may attract a late fee.",
      category: "fees",
      postedById: professor.id,
    },
  ]);

  /* TP Cell: companies + question bank */
  const companies = await Company.bulkCreate([
    { name: "Infosys", sector: "IT Services", ctcRange: "₹3.6 – 9.5 LPA", description: "Mass recruiter. Aptitude round followed by two technical rounds and HR." },
    { name: "TCS", sector: "IT Services", ctcRange: "₹3.4 – 11.5 LPA", description: "NQT-based hiring. Strong emphasis on aptitude and reasoning." },
    { name: "Amazon", sector: "Product", ctcRange: "₹18 – 32 LPA", description: "Two online DSA rounds, then bar-raiser and leadership principle interviews." },
    { name: "Deloitte", sector: "Consulting", ctcRange: "₹6.5 – 12 LPA", description: "Case-style technical discussion plus behavioural rounds." },
  ]);

  const [infosys, tcs, amazon, deloitte] = companies;

  await Question.bulkCreate([
    { companyId: amazon.id, year: 2025, type: "dsa", difficulty: "easy", topic: "Arrays", title: "Two Sum", content: "Return indices of the two numbers adding up to a target.", answer: "Single-pass hash map, O(n) time and O(n) space." },
    { companyId: amazon.id, year: 2025, type: "dsa", difficulty: "medium", topic: "Linked List", title: "Reorder List", content: "Reorder L0 → Ln → L1 → Ln-1 → … in place.", answer: "Find middle, reverse second half, merge alternately." },
    { companyId: amazon.id, year: 2024, type: "dsa", difficulty: "hard", topic: "Graphs", title: "Word Ladder II", content: "Return every shortest transformation sequence between two words.", answer: "BFS to build the level graph, then DFS to reconstruct paths." },
    { companyId: amazon.id, year: 2025, type: "dsa", difficulty: "medium", topic: "Trees", title: "Lowest Common Ancestor", content: "Find the lowest common ancestor of two nodes in a binary tree.", answer: "Post-order recursion returning the first node where both sides are non-null." },
    { companyId: infosys.id, year: 2025, type: "aptitude", difficulty: "easy", topic: "Percentages", title: "Profit and loss on a discounted sale", content: "An item marked at ₹1,200 is sold at 15% discount with a 20% profit. Find the cost price.", answer: "₹850." },
    { companyId: infosys.id, year: 2025, type: "dsa", difficulty: "easy", topic: "Strings", title: "Reverse words in a sentence", content: "Reverse the order of words without using split helpers.", answer: "Reverse the whole string, then reverse each word in place." },
    { companyId: infosys.id, year: 2024, type: "technical", difficulty: "medium", topic: "DBMS", title: "Explain normalisation up to 3NF", content: "Walk through 1NF, 2NF and 3NF with an example table.", answer: "Remove repeating groups, then partial dependencies, then transitive dependencies." },
    { companyId: tcs.id, year: 2025, type: "aptitude", difficulty: "easy", topic: "Time and Work", title: "Pipes filling a tank", content: "Two pipes fill a tank in 12 and 18 minutes. How long together?", answer: "7.2 minutes." },
    { companyId: tcs.id, year: 2025, type: "aptitude", difficulty: "medium", topic: "Reasoning", title: "Seating arrangement with six people", content: "Six friends sit in a circle facing centre. Deduce the arrangement from four clues.", answer: "Fix one person, then apply the relative clues in order." },
    { companyId: tcs.id, year: 2024, type: "technical", difficulty: "medium", topic: "OS", title: "Deadlock conditions", content: "Name the four Coffman conditions and how to break each.", answer: "Mutual exclusion, hold and wait, no preemption, circular wait." },
    { companyId: tcs.id, year: 2025, type: "dsa", difficulty: "hard", topic: "DP", title: "Longest palindromic subsequence", content: "Find the length of the longest palindromic subsequence.", answer: "LCS of the string and its reverse, O(n²)." },
    { companyId: deloitte.id, year: 2025, type: "hr", difficulty: "easy", topic: "Behavioural", title: "Describe a conflict in a team project", content: "Structure the answer with situation, action and outcome.", answer: "Keep it specific, own your part, end with what changed afterwards." },
    { companyId: deloitte.id, year: 2024, type: "technical", difficulty: "medium", topic: "SQL", title: "Second highest salary", content: "Write a query returning the second highest salary from an employees table.", answer: "Use DENSE_RANK() or a correlated subquery with MAX." },
    { companyId: deloitte.id, year: 2025, type: "aptitude", difficulty: "hard", topic: "Data Interpretation", title: "Multi-table revenue comparison", content: "Compare year-on-year growth across four business lines from two tables.", answer: "Compute per-line growth first, then rank." },
  ]);

  /* Placement calendar */
  await CalendarEvent.bulkCreate([
    { title: "Infosys pre-placement talk", eventDate: dateOffset(1), startTime: "10:00 AM", venue: "Seminar Hall A", type: "seminar" },
    { title: "Infosys online assessment", eventDate: dateOffset(3), startTime: "02:00 PM", venue: "Computer Lab 2", type: "company_visit" },
    { title: "Resume submission deadline — TCS", eventDate: dateOffset(4), startTime: "11:59 PM", venue: "Portal", type: "deadline" },
    { title: "Amazon campus interviews", eventDate: dateOffset(6), startTime: "09:00 AM", venue: "Placement Block", type: "company_visit" },
    { title: "Mock aptitude test", eventDate: dateOffset(2), startTime: "04:00 PM", venue: "LT-1", type: "exam" },
  ]);

  await Material.bulkCreate([
    {
      kind: "assignment",
      title: "Assignment 3 — MapReduce design",
      description: "Design a MapReduce job for word frequency across 10 GB of logs. Submit a one-page write-up.",
      subject: "Distributed Systems",
      dueDate: dateOffset(7),
      originalName: "assignment-3.pdf",
      storedPath: "sample-assignment-3.pdf",
      mimeType: "application/pdf",
      sizeBytes: 0,
      uploadedById: professor.id,
    },
    {
      kind: "note",
      title: "Unit 4 notes — Gradient descent",
      description: "Covers batch, stochastic and mini-batch variants with worked examples.",
      subject: "Machine Learning",
      originalName: "ml-unit-4.pdf",
      storedPath: "sample-ml-unit-4.pdf",
      mimeType: "application/pdf",
      sizeBytes: 0,
      uploadedById: professor.id,
    },
  ]);

  await ActivityLog.bulkCreate([
    { userId: student.id, action: "Signed in", detail: "Portal login" },
    { userId: student.id, action: "Viewed TP Cell notice", detail: "Infosys campus drive" },
    { userId: student.id, action: "Generated practice set", detail: "Amazon — 10 questions" },
  ]);

  console.log("Seed complete. Accounts (password for all: %s):", PASSWORD);
  console.table([
    { role: "student", email: "aarav@acadex.edu" },
    { role: "professor", email: "meera@acadex.edu" },
    { role: "tp_admin", email: "tpcell@acadex.edu" },
    { role: "parent", email: "sunita@acadex.edu" },
  ]);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
