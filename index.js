/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// fs is a Node standard library package for reading and writing files
const fs = require('fs');
const pool = require('./utils/database');

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");
const databaseName = 'employees_db';

const initializeDb = async function () {
    const connection = await mysql.createConnection(
        {
            connectionLimit: 100,
            host: 'localhost',
            user: process.env.UID,
            password: process.env.PWD,
            debug: false
        });
    const [rows] = await connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [databaseName]);

    if (rows.length === 0) {
        // Database doesn't exist, create it
        await connection.query(`CREATE DATABASE ${databaseName}`);
        console.log(`Database "${databaseName}" created.`);
    } else {

        await connection.query(`USE ${databaseName}`);
        await connection.query('CREATE TABLE IF NOT EXISTS `department` (`id` INT AUTO_INCREMENT, `name` varchar(30) NOT NULL, PRIMARY KEY (`id`));');
        
        console.log("Tables created!");
    }
};

const init = () => {

    initializeDb();

    // pool.getConnection(function (err, db) {

    //     console.log(sSql);

    //     db.query(sSql, (error, results) => {
    //         if (error) {
    //             console.log(error)
    //         } else {
    //             console.log("SQL Statement successfully ran!")
    //         }
    //     });
    //     db.release();
    // });

};

/**
 * Entry point for the application. File will trigger this when it finishes
 * loading
 */
init();