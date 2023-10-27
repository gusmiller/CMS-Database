/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

// fs is a Node standard library package for reading and writing files
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
var pool = require('./utils/database');

// Express middleware - The express.urlencoded() function is a built-in middleware
// function in Express. It parses incoming requests with URL-encoded payloads and 
// is based on a body parser.
// https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync('./db/schema.sql', 'utf-8')

const init = () => {

    pool.getConnection(function (err, db) {

        db.query(sSql, (error, results) => {
            if (error) {
                console.log("Error while executing SQL Statement!")
            } else {
                console.log("SQL Statement successfully ran!")
            }
        });
        db.release();
    });
    
};

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/**
 * Entry point for the application. File will trigger this when it finishes
 * loading
 */
init();