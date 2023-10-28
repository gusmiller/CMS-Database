/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/28/2023 4:22:09 AM
 * 
 * Description :
 * This file is used to declare the array with all the questions the 
 * application will loop through 
 *******************************************************************/
const chalk = require('chalk');

const actionlist = [
    
    "View All Employees",
    "View All Departments",
    "View All Roles",
    "Add a Ddepartment",
    "Add a Role",
    "Add an Employee",
    "Update an Employee Role",
    "Finish"
]

let hours = new Date().getHours();
hours = (hours+24-2)%24; 
const ampm = (hours >= 12) ? "afternoon," : "morning,";

const action = [
    {
        type: 'list',
        name: 'actionperform',
        message: chalk.blue(`Good ${ampm} what would you like to do today?`),
        choices: actionlist,
        default: "View All Employees"
    }
]

module.exports = {action}