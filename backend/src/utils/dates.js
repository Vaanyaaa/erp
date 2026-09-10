/**
 * Calendar dates are DATEONLY values ("2026-03-09") with no timezone attached.
 *
 * Do NOT format them with toISOString(): that converts local midnight to UTC,
 * which in IST (+5:30) rolls back to the previous day. The result was that a
 * day cell labelled "10" carried the bucket date "…-09", so an event added on
 * the 9th appeared under the 10th. Always build the string from local parts.
 */

function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Parses "YYYY-MM-DD" into a local-midnight Date, never a UTC one. */
function fromISODate(value) {
  if (value instanceof Date) return value;
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfWeek(date) {
  const d = fromISODate(toISODate(date));
  d.setDate(d.getDate() - d.getDay()); // Sunday
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function today() {
  return toISODate(new Date());
}

module.exports = { toISODate, fromISODate, startOfWeek, addDays, today };
