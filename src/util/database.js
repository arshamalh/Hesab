import {Pool} from "pg"

require("dotenv").config()

export function DataBaseInit() {
  global.db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })
}

export function newVendor(id, username, name, phone, cb) {
  const sql = {
    text: `INSERT INTO vendors 
             (id, username, name, phone)
             VALUES ($1, $2, $3, $4);`,
    values: [id, username, name, phone]
  }

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      cb(true)
    }
  })
}

export function newUser(name, phone, reason, amount, vendor_id, cb) {
  const sql = {
    text: `INSERT INTO customers 
             (name, phone, reason, amount, vendor_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id;`,
    values: [name, phone, reason, amount, vendor_id]
  }

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      cb(res.rows[0]["id"])
    }
  })
}

export function getAllDebts(vendor_id, debtor_id = null) {
  return new Promise((resolve, reject) => {
    let sql;
    // Actually here we want to get an specific user
    if (debtor_id) sql = {
      text: `SELECT * FROM customers WHERE id = $1`,
      values: [debtor_id]
    }
    // We want to get all unsettled user which a specific vendor have made.
    else sql = {
      text: `SELECT * FROM customers WHERE settled=false AND vendor_id = $1`,
      values: [vendor_id]
    }
    db.query(sql, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res.rows)
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