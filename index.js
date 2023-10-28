/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 5:06:05 PM
 *******************************************************************/

// Dotenv is a zero-dependency module that loads environment variables from 
// a .env file into process.env. Storing configuration in the environment 
// separate from code is based on The Twelve-Factor App methodology
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Include packages needed for this application
const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

// fs is a Node standard library package for reading and writing files
const fs = require("fs");

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");
const questions = require("./utils/questions");
const connectDb = require("./utils/connect");
const dataset = require("./utils/data");

async function getTable(value) {
    const connection = await connectDb();

    try {

        const [rows, fields] = await connection.execute(`SELECT * FROM ${value}`);
        return rows;

    } catch (error) {
        console.error('Error retrieving data:', error);

    } finally {
        connection.end(); // Close the database connection when done
    }
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
                const dsEmployee = await dataset.getTable("employee");
                console.log(dsEmployee);
                break;
            case "View All Departments":
                const dsDepartment = await dataset.getTable("department");
                console.log(dsDepartment);
                break;
            case "View All Roles":
                const dsRoles = await dataset.getTable("role");
                console.log(dsRoles);
                break;
            case "Add a Department":
                console.log("Add a Department")
                const departmentresponse = await inquirer.prompt(questions.department);
                break;
            case "Add a Role":
                console.log("Add a Role")
                const rolesresponse = await inquirer.prompt(questions.roles);
                break;
            case "Add an Employee":
                console.log("Add an Employee")
                const empresponse = await inquirer.prompt(questions.employee);
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
