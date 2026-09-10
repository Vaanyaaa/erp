const path = require("path");
const { Sequelize } = require("sequelize");

/**
 * Zero-config by default: if DATABASE_URL is not set, we fall back to a local
 * SQLite file so the project runs with `npm run dev` and nothing else installed.
 * Set DATABASE_URL to a Postgres connection string (Supabase / Neon / local)
 * and the exact same models/queries run on Postgres — no code changes.
 */
const databaseUrl = process.env.DATABASE_URL;
const usePostgres = Boolean(databaseUrl && databaseUrl.startsWith("postgres"));

const sequelize = usePostgres
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions:
        process.env.DB_SSL === "true"
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {},
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "..", "..", "acadex.sqlite"),
      logging: false,
    });

module.exports = { sequelize, usePostgres };
