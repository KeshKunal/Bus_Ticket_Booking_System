import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const buildSslConfig = () => {
  if (process.env.DB_SSL !== "true") {
    return undefined;
  }

  const caPath = process.env.DB_SSL_CA_PATH;
  if (caPath) {
    return {
      ca: fs.readFileSync(caPath, "utf8"),
    };
  }

  return {
    rejectUnauthorized: false,
  };
};

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: buildSslConfig(),
});

export const withTransaction = async (handler) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await handler(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
