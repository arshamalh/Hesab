import {saveToSession} from "./session";

const {Pool} = require('pg')
require("dotenv").config()

const createTable = `CREATE TABLE IF NOT EXISTS Customers (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   phone VARCHAR(20) NOT NULL,
   fofName VARCHAR(100),
   settled VARCHAR(10),
   amount NUMERIC,
   reason TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   settled_at TIMESTAMP WITH TIME ZONE
);`

export function DataBaseInit() {
  global.db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })

  db.query(createTable, (err, res) => {
    if (err) console.log(err)
    else console.log("Table created")
  })
}

export function newUser(name, fofName, phone, reason, amount, settled, cb) {
  const sql = {
    text: `INSERT INTO Customers 
             (name, fofName, phone, reason, amount, settled)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id;`,
    values: [name, fofName, phone, reason, amount, settled]
  }

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      cb(res.rows[0]["id"])
    }
  })
}

export function makeDebtList(ctx) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Customers`
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
      text: `DELETE FROM Customers WHERE id = $1`,
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
      text: `UPDATE Customers SET settled='آره' WHERE id = $1`,
      values: [id]
    }

    db.query(sql, (err, res) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}