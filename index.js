/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/

// Include packages needed for this application
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// fs is a Node standard library package for reading and writing files
const fs = require('fs');
const data = require('./utils/data');

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");
const databaseName = 'employees_db';

const questions = require("./utils/questions");

const init = () => {

    process.stdout.write('\x1Bc');

    inquirer.prompt(questions.action)
        .then((answer) => {

            let getData = new data();

            switch (answer.actionperform) {
                case "View All Employees":
                    const [EmployeeData, fieldEmpPacket] = getData.listALLTable("employee");
                    console.log("View All Employees")
                    break;
                case "View All Departments":
                    const [DepartmentData]  = getData.listALLTable("department");
                    console.log("View All Departments")
                    break;
                case "View All Roles":
                    const [RolesData] = getData.listALLTable("role");
                    console.log("View All Roles")
                    break;
                case "Add a Ddepartment":
                    console.log("Add a Ddepartment")
                    break;
                case "Add a Role":
                    console.log("Add a Role")
                    break;
                case "Add an Employee":
                    console.log("Add an Employee")
                    break;
                case "Update an Employee Role":
                    console.log("Update an Employee Role")
                    break;
                case "Finish":
                    console.log("Finish")
                    break;
            }
        });
};

/**
 * Entry point for the application. File will trigger this when it finishes
 * loading
 */
init();