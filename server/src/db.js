const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
})

pool.connect((err) => {
  if (err) {
    console.error('❌ DB connection error:', err.message)
  } else {
    console.log('✅ Connected to Progresso DB!')
  }
})

module.exports = pool