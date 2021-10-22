const sqlite3 = require('sqlite3').verbose();
require("dotenv").config()

const createTable = `CREATE TABLE IF NOT EXISTS Customers (
   id integer NOT NULL PRIMARY KEY,
   name text NOT NULL,
   fofName text NOT NULL,
   reason text,
   amount integer,
   settled text,
   phone text
);`

export function DataBaseInit() {
    // open the database
    global.db = new sqlite3.Database(process.env.DB_PATH, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    db.exec(createTable, (e) => {
        if (e) console.log(e)
        else console.log("Table created")
    })
}

export function newUser(name, fofName, reason, amount, settled, phone, cb) {
    const sql = `INSERT INTO Customers 
                 (name, fofName, reason, amount, settled, phone)
                 VALUES (?, ?, ?, ?, ?, ?);`

    db.run(sql, [name, fofName, reason, amount, settled, phone], function (error) {
        if (error) {
            console.log(error)
        } else {
            cb(this.lastID)
            console.log("# of Row Changes: " + this.changes)
        }
    })
}