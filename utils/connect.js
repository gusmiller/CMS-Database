/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 * 
 * Description: This will connect with database. It requires to have 
 * the Dotenv - a zero-dependency module that loads environment variables 
 * from .env file. https://www.npmjs.com/package/dotenv
 *******************************************************************/
require('dotenv').config();

const mysql = require('mysql2/promise');

async function database() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

async function validatedatabase(value) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = { database, validatedatabase };