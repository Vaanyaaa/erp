const express = require("express");
const { Op } = require("sequelize");
const { CalendarEvent, Notice, Material, User } = require("../models");
const { authenticate, requireRole } = require("../middleware/auth");
const { toISODate, fromISODate, startOfWeek, addDays, today } = require("../utils/dates");

const router = express.Router();

/**
 * The calendar is an aggregate view, not just a list of TP Cell events.
 * Three sources feed it:
 *   - calendar_events   company visits, seminars, deadlines, exams
 *   - notices           any notice that was given a date
 *   - materials         assignment due dates
 * Each item carries a `source` and `category` so the UI can filter.
 */
const CATEGORY_FOR_EVENT = {
  company_visit: "tp_cell",
  seminar: "tp_cell",
  deadline: "tp_cell",
  exam: "exam",
};

async function collectItems(fromDate, toDate) {
  const [events, notices, materials] = await Promise.all([
    CalendarEvent.findAll({
      where: { eventDate: { [Op.between]: [fromDate, toDate] } },
      order: [["eventDate", "ASC"]],
    }),
    Notice.findAll({
      where: { eventDate: { [Op.between]: [fromDate, toDate] } },
      include: [{ model: User, as: "postedBy", attributes: ["id", "fullName"] }],
      order: [["eventDate", "ASC"]],
    }),
    Material.findAll({
      where: { dueDate: { [Op.between]: [fromDate, toDate] } },
      include: [{ model: User, as: "uploadedBy", attributes: ["id", "fullName"] }],
      order: [["dueDate", "ASC"]],
    }),
  ]);

  const items = [];

  for (const e of events) {
    items.push({
      id: `event-${e.id}`,
      refId: e.id,
      source: "calendar",
      category: CATEGORY_FOR_EVENT[e.type] || "tp_cell",
      type: e.type,
      title: e.title,
      date: e.eventDate,
      time: e.startTime || null,
      venue: e.venue || null,
      detail: e.notes || null,
      canDelete: true,
    });
  }

  for (const n of notices) {
    items.push({
      id: `notice-${n.id}`,
      refId: n.id,
      source: "notice",
      category: n.category,
      type: n.category,
      title: n.title,
      date: n.eventDate,
      time: null,
      venue: null,
      detail: n.body,
      postedBy: n.postedBy?.fullName,
      canDelete: false,
    });
  }

  for (const m of materials) {
    items.push({
      id: `material-${m.id}`,
      refId: m.id,
      source: "material",
      category: "assignment",
      type: m.kind,
      title: `Due: ${m.title}`,
      date: m.dueDate,
      time: null,
      venue: null,
      detail: m.subject || null,
      postedBy: m.uploadedBy?.fullName,
      canDelete: false,
    });
  }

  return items;
}

/**
 * GET /api/calendar/month?year=2026&month=3   (month is 1-based)
 * Returns padded week rows so the UI can render a grid directly.
 */
router.get("/month", authenticate, async (req, res) => {
  const now = new Date();
  const year = Number(req.query.year) || now.getFullYear();
  const month = Number(req.query.month) || now.getMonth() + 1;

  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);

  // Pad out to whole weeks (Sunday-first) so the grid is always rectangular.
  const gridStart = startOfWeek(first);
  const gridEnd = addDays(startOfWeek(last), 6);

  const items = await collectItems(toISODate(gridStart), toISODate(gridEnd));

  const weeks = [];
  let cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const iso = toISODate(cursor);
      week.push({
        date: iso,
        dayOfMonth: cursor.getDate(),
        inMonth: cursor.getMonth() === month - 1,
        isToday: iso === today(),
        items: items.filter((it) => it.date === iso),
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }

  res.json({
    year,
    month,
    monthLabel: first.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    weeks,
    totalItems: items.length,
  });
});

/**
 * GET /api/calendar/week?start=YYYY-MM-DD
 * Seven day buckets for the dashboard strip.
 */
router.get("/week", authenticate, async (req, res) => {
  const anchor = req.query.start ? fromISODate(req.query.start) : new Date();
  const from = startOfWeek(anchor);
  const to = addDays(from, 6);

  const items = await collectItems(toISODate(from), toISODate(to));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(from, i);
    const iso = toISODate(d);
    return {
      date: iso,
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayOfMonth: d.getDate(),
      isToday: iso === today(),
      items: items.filter((it) => it.date === iso),
      // kept for older callers that expected `events`
      events: items.filter((it) => it.date === iso),
    };
  });

  res.json({ weekStart: toISODate(from), weekEnd: toISODate(to), days });
});

/** GET /api/calendar/upcoming */
router.get("/upcoming", authenticate, async (req, res) => {
  const from = today();
  const to = toISODate(addDays(new Date(), 60));
  const items = await collectItems(from, to);
  items.sort((a, b) => a.date.localeCompare(b.date));
  res.json({ items: items.slice(0, Number(req.query.limit) || 5) });
});

/** POST /api/calendar — professors and the TP Cell can add events. */
router.post("/", authenticate, requireRole("tp_admin", "professor"), async (req, res) => {
  const { title, eventDate, startTime, venue, type, notes } = req.body;
  if (!title || !eventDate) {
    return res.status(400).json({ message: "An event needs a title and a date." });
  }

  const event = await CalendarEvent.create({
    title,
    // Store exactly the day that was picked — no Date round-trip, because that
    // is what shifted dates by one in the first place.
    eventDate: String(eventDate).slice(0, 10),
    startTime,
    venue,
    type,
    notes,
  });

  res.status(201).json({ event });
});

router.delete("/:id", authenticate, requireRole("tp_admin", "professor"), async (req, res) => {
  const event = await CalendarEvent.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "That event no longer exists." });
  await event.destroy();
  res.json({ deleted: true });
});

module.exports = router;
