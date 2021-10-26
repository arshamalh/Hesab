/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
      CREATE TABLE IF NOT EXISTS vendors (
      id BIGINT PRIMARY KEY,
      username varchar(50),
      name varchar(100),
      phone varchar(15),
      created_at DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS customers (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       settled BOOL DEFAULT false,
       amount NUMERIC,
       reason TEXT,
       vendor_id BIGINT REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       settled_at TIMESTAMP WITH TIME ZONE
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE customers;
    DROP TABLE vendors;
  `)
};
