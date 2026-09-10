const express = require("express");
const { Op } = require("sequelize");
const {
  User,
  StudentProfile,
  Attendance,
  Fee,
  Course,
  TimetableSlot,
  ActivityLog,
  Notice,
  CalendarEvent,
} = require("../models");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

/**
 * Resolves whose academic record a request is about.
 * Students see their own; parents see the ward they registered against;
 * professors and TP admins get the class-wide view instead of one student.
 */
async function resolveStudent(user) {
  if (user.role === "student") return user;
  if (user.role === "parent" && user.parentProfile?.childEnrollmentNo) {
    const profile = await StudentProfile.findOne({
      where: { enrollmentNo: user.parentProfile.childEnrollmentNo },
    });
    if (profile) return User.findByPk(profile.userId, { include: [{ model: StudentProfile, as: "studentProfile" }] });
  }
  return null;
}

/** GET /api/academics/summary — powers the four overview cards. */
router.get("/summary", authenticate, async (req, res) => {
  const student = await resolveStudent(req.user);

  if (!student) {
    // Staff view: institution-wide counts rather than a personal record.
    const [studentCount, courseCount, noticeCount, upcoming] = await Promise.all([
      User.count({ where: { role: "student" } }),
      Course.count(),
      Notice.count(),
      CalendarEvent.count({
        where: { eventDate: { [Op.gte]: new Date().toISOString().slice(0, 10) } },
      }),
    ]);

    return res.json({
      scope: "staff",
      cards: {
        courses: { value: courseCount, label: "Courses offered" },
        attendance: { value: studentCount, label: "Students enrolled" },
        assignments: { value: noticeCount, label: "Notices published" },
        results: { value: upcoming, label: "Upcoming events" },
      },
    });
  }

  const records = await Attendance.findAll({ where: { studentId: student.id } });
  const present = records.filter((r) => r.status === "present").length;
  const rate = records.length ? Math.round((present / records.length) * 100) : null;

  const [courseCount, pendingFees] = await Promise.all([
    Course.count({
      where: student.studentProfile?.department
        ? { department: student.studentProfile.department }
        : {},
    }),
    Fee.count({ where: { studentId: student.id, status: { [Op.ne]: "paid" } } }),
  ]);

  res.json({
    scope: req.user.role === "parent" ? "ward" : "self",
    student: {
      fullName: student.fullName,
      enrollmentNo: student.studentProfile?.enrollmentNo,
    },
    cards: {
      courses: { value: courseCount, label: "Enrolled courses" },
      attendance: {
        value: rate === null ? null : `${rate}%`,
        label: records.length ? `${present} of ${records.length} classes` : "No records yet",
      },
      assignments: { value: pendingFees, label: "Pending fee items" },
      results: { value: null, label: "Awaiting result upload" },
    },
  });
});

/** GET /api/academics/attendance — records plus a per-course breakdown. */
router.get("/attendance", authenticate, async (req, res) => {
  const student = await resolveStudent(req.user);
  if (!student) {
    return res.json({ scope: "staff", records: [], byCourse: [], overall: null });
  }

  const records = await Attendance.findAll({
    where: { studentId: student.id },
    include: [{ model: Course, as: "course", attributes: ["id", "code", "name"] }],
    order: [["date", "DESC"]],
  });

  const grouped = {};
  for (const r of records) {
    const key = r.course?.code || "General";
    grouped[key] = grouped[key] || { code: key, name: r.course?.name || "General", total: 0, present: 0 };
    grouped[key].total += 1;
    if (r.status === "present") grouped[key].present += 1;
  }

  const byCourse = Object.values(grouped).map((g) => ({
    ...g,
    percentage: Math.round((g.present / g.total) * 100),
  }));

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;

  res.json({
    scope: req.user.role === "parent" ? "ward" : "self",
    overall: total ? Math.round((present / total) * 100) : null,
    present,
    absent: total - present,
    total,
    byCourse,
    records: records.slice(0, 30),
  });
});

/** GET /api/academics/fees */
router.get("/fees", authenticate, async (req, res) => {
  const student = await resolveStudent(req.user);
  if (!student) return res.json({ scope: "staff", fees: [], totals: null });

  const fees = await Fee.findAll({
    where: { studentId: student.id },
    order: [["dueDate", "ASC"]],
  });

  const totals = fees.reduce(
    (acc, f) => {
      acc.total += f.amountDue;
      if (f.status === "paid") acc.paid += f.amountDue;
      else acc.outstanding += f.amountDue;
      return acc;
    },
    { total: 0, paid: 0, outstanding: 0 }
  );

  res.json({ scope: req.user.role === "parent" ? "ward" : "self", fees, totals });
});

/** GET /api/academics/courses */
router.get("/courses", authenticate, async (req, res) => {
  const student = await resolveStudent(req.user);
  const where = student?.studentProfile?.department
    ? { department: student.studentProfile.department }
    : {};
  const courses = await Course.findAll({ where, order: [["code", "ASC"]] });
  res.json({ courses });
});

/**
 * A professor's timetable is the set of classes they teach; a student's (or
 * their parent's) is the set their department runs.
 */
async function timetableFilter(user) {
  if (user.role === "professor") return { professorId: user.id };
  const student = await resolveStudent(user);
  return student?.studentProfile?.department
    ? { department: student.studentProfile.department }
    : {};
}

/** GET /api/academics/timetable/today */
router.get("/timetable/today", authenticate, async (req, res) => {
  const where = { ...(await timetableFilter(req.user)), dayOfWeek: new Date().getDay() };

  const slots = await TimetableSlot.findAll({
    where,
    order: [["startTime", "ASC"]],
  });
  res.json({ dayOfWeek: where.dayOfWeek, slots });
});

/** GET /api/academics/timetable — full week grid. */
router.get("/timetable", authenticate, async (req, res) => {
  const slots = await TimetableSlot.findAll({
    where: await timetableFilter(req.user),
    order: [
      ["dayOfWeek", "ASC"],
      ["startTime", "ASC"],
    ],
  });
  res.json({ slots });
});

/** GET /api/academics/activity — the signed-in user's own recent actions. */
router.get("/activity", authenticate, async (req, res) => {
  const activity = await ActivityLog.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.json({ activity });
});

module.exports = router;
