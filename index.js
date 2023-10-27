/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/
const mysql = require('mysql2');
const inquirer = require('inquirer');

// fs is a Node standard library package for reading and writing files
const fs = require('fs');
const pool = require('./utils/database');

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

/**
 * Entry point for the application. File will trigger this when it finishes
 * loading
 */
init();