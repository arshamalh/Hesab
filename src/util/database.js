import {saveToSession} from "./session";

const {Pool} = require('pg')
require("dotenv").config()

export function DataBaseInit() {
  global.db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })

  const createTable = `
    CREATE TABLE IF NOT EXISTS customers (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       settled BOOL DEFAULT false,
       amount NUMERIC,
       reason TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       settled_at TIMESTAMP WITH TIME ZONE
    );
  `

  db.query(createTable, (err, res) => {
    if (err) console.log(err)
    else console.log("Table created")
  })
}

export function newUser(name, phone, reason, amount, cb) {
  const sql = {
    text: `INSERT INTO Customers 
             (name, phone, reason, amount)
             VALUES ($1, $2, $3, $4)
             RETURNING id;`,
    values: [name, phone, reason, amount]
  }

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      cb(res.rows[0]["id"])
    }
  })
}

export function getAllDebts(cb) {
  const sql = `SELECT * FROM customers WHERE settled = false;`
  db.query(sql, (err, res) => {
    if (err) console.log(err)
    else {
      cb(res.rows)
    }
  })
}

export function makeDebtList(ctx, id = null) {
  return new Promise((resolve, reject) => {
    let sql;
    if (id) sql = {
      text: `SELECT * FROM customers WHERE id = $1`,
      values: [id]
    }
    else sql = `SELECT * FROM customers WHERE settled=false`
    db.query(sql, (err, res) => {
      if (err) reject(err)
      else {
        ctx.session.debts = res.rows
        saveToSession(ctx);
        resolve(true)
      }
    })
  })
}

export function removeDebtDB(id) {
  return new Promise((resolve, reject) => {
    const sql = {
      text: `DELETE FROM customers WHERE id = $1`,
      values: [id]
    }
    db.query(sql, (err, res) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

export function settleDebtDB(id) {
  return new Promise((resolve, reject) => {
    const sql = {
      text: `UPDATE customers SET settled=true, settled_at=CURRENT_TIMESTAMP WHERE id = $1`,
      values: [id]
    }

    db.query(sql, (err, res) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}