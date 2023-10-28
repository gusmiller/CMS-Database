/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// fs is a Node standard library package for reading and writing files
const fs = require('fs');
const pool = require('./utils/connect');

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");
const databaseName = 'employees_db';

const init = () => {
    console.log("Test");
};

/**
 * Entry point for the application. File will trigger this when it finishes
 * loading
 */
init();