const sql = require('mssql');

const config = {
  server: "103.12.1.132",
  port: 8138,             
  database: "scmtrial",
  options: {
    encrypt: false,       
    enableArithAbort: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

module.exports = { getConnection, sql };