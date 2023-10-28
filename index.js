/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/
require('dotenv').config();

// Include packages needed for this application
const mysql = require("mysql2");
const inquirer = require("inquirer");

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// fs is a Node standard library package for reading and writing files
const fs = require("fs");

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");
const questions = require("./utils/questions");

function connectDatabase() {
    return mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
    );
}

/**
 * Entry point for the application. Inquire questionnaire will continue until
 * the users selects to finish or cancels nodejs executions.
 */
async function init() {
    let exit = false;

    process.stdout.write("\x1Bc");

    while (!exit) {
        const answer = await inquirer.prompt(questions.action);

        switch (answer.actionperform) {
            case "View All Employees":
                console.log("View All Employees");
                break;
            case "View All Departments":
                console.log("View All Departments")
                break;
            case "View All Roles":
                console.log("View All Roles")
                break;
            case "Add a Department":
                console.log("Add a Department")
                const response = await inquirer.prompt(questions);
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
                process.stdout.write("\x1Bc");
                console.log("Thank you for participating!")
                exit = true;
                break;
        }
    }
}

init().catch((error) => console.error(error));
