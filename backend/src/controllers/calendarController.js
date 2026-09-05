const { Op } = require("sequelize");
const { CalendarEvent, User } = require("../models");

exports.createEvent = async (req, res) => {
  try {
    const { title, eventDate, eventType, description } = req.body;
    if (!title || !eventDate) {
      return res.status(400).json({ message: "title and eventDate are required." });
    }

    const event = await CalendarEvent.create({
      title,
      eventDate,
      eventType: eventType || "other",
      description,
      createdById: req.user.id,
    });

    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event.", error: err.message });
  }
};

// Returns events for a given week (defaults to the current week).
// Query param: ?start=YYYY-MM-DD (any date in the target week)
exports.getWeek = async (req, res) => {
  try {
    const anchor = req.query.start ? new Date(req.query.start) : new Date();
    const dayOfWeek = anchor.getDay(); // 0 = Sunday
    const monday = new Date(anchor);
    monday.setDate(anchor.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const events = await CalendarEvent.findAll({
      where: {
        eventDate: {
          [Op.between]: [
            monday.toISOString().slice(0, 10),
            sunday.toISOString().slice(0, 10),
          ],
        },
      },
      include: [{ model: User, as: "createdBy", attributes: ["fullName", "role"] }],
      order: [["eventDate", "ASC"]],
    });

    res.json({
      weekStart: monday.toISOString().slice(0, 10),
      weekEnd: sunday.toISOString().slice(0, 10),
      events,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch week.", error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    await event.destroy();
    res.json({ message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event.", error: err.message });
  }
};
