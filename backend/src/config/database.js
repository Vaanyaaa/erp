const { Sequelize } = require("sequelize");

// Works with ANY Postgres provider — local, Supabase, Neon, Railway, RDS —
// just point DATABASE_URL at whichever one you're using. Nothing else changes.
//
// Local example:    postgresql://postgres:devpassword@localhost:5432/edusphere_erp
// Supabase example: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
// Neon example:     postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require

const isProduction = process.env.NODE_ENV === "production";
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:devpassword@localhost:5432/edusphere_erp";

// Most hosted Postgres providers (Supabase, Neon, Railway) require SSL in
// production but reject self-signed cert verification unless relaxed like this.
const dialectOptions =
  isProduction || connectionString.includes("sslmode=require")
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  dialectOptions,
  logging: isProduction ? false : console.log,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;
