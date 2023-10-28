/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 *******************************************************************/
const mysql = require('mysql2');

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// Connection pool is similar to a cache where we store frequently accessed data. 
// Here the data is a database connection. The goal is to achieve the reusability 
// of the database connections instead of creating a new connection every time 
// there is a demand for the data
// https://codeforgeek.com/node-mysql-connection-pool-example/
var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool.promise();