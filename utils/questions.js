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
const dataset = require("./data");

const actionlist = [

    "View All Employees",
    "View All Departments",
    "View All Roles",
    "Add a Department",
    "Add a Role",
    "Add an Employee",
    "Update an Employee Role",
    "Finish",
    "Clear Terminal"
]

let hours = new Date().getHours();
hours = (hours + 24 - 2) % 24;
const ampm = (hours >= 12) ? "afternoon," : "morning,";

const updateEmployee = [
    {
        type: 'list',
        name: 'updateemployee',
        message: chalk.blue(`Select the Employee you like to update?`),
        choices: dataset.employeeArray
    }
]

const updateRole = [
    {
        type: 'list',
        name: 'updaterole',
        message: chalk.blue(`Select the new Role for the selected Employee?`),
        choices: dataset.rolesArray
    }
]

const action = [
    {
        type: 'list',
        name: 'actionperform',
        message: chalk.blue(`Good ${ampm} what would you like to do today?`),
        choices: actionlist,
        default: "View All Employees"
    }
]

const department = [
    {
        type: "input",
        name: "department",
        message: chalk.magenta("Please enter Name of Department you like to add:"),
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid name for Department! Press Ctrl-C to cancel');
            } else if (answer.length < 5 || answer.length > 30) {
                return chalk.red('Department name has to be between 5 to 30 characters! Press Ctrl-C to cancel');
            }

            return true;
        }

    }
]

const roles = [
    {
        type: "input",
        name: "rolename",
        message: chalk.magenta("Please enter Role name to add:"),
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid Role name! Press Ctrl-C to cancel');
            } else if (answer.length < 5 || answer.length > 120) {
                return chalk.red('Role name has to be between 5 to 120 characters! Press Ctrl-C to cancel');
            }
            return true;
        }

    },
    {
        type: "number",
        name: "salary",
        message: chalk.magenta("Please enter Role's base Salary:"),
        when(answer) {
            return answer.rolename.length != 0;
        },
        validate(answer) {
            if (answer == 0 || !isNumeric(answer)) {
                return chalk.red('You must provide a valid Salary amount! Press Ctrl-C to cancel');
            }
            return true;
        }

    },
    {
        type: "list",
        name: "department",
        message: chalk.magenta("Please enter Name of Department:"),
        choices: dataset.departmentsArray,
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid Department Name! Press Ctrl-C to cancel');
            }
            return true;
        }

    }
]

const employee = [
    {
        type: "input",
        name: "firstname",
        message: chalk.greenBright("Please enter Employee's First name to add:"),
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid name! Press Ctrl-C to cancel');
            } else if (answer.length < 3 || answer.length > 30) {
                return chalk.red('First name has to be between 5 to 30 characters! Press Ctrl-C to cancel');
            }
            return true;
        }

    },
    {
        type: "input",
        name: "lastname",
        message: chalk.greenBright("Please enter Last name to add:"),
        when(answer) {
            return answer.firstname.length != 0;
        },
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid last name! Press Ctrl-C to cancel');
            } else if (answer.length < 2 || answer.length > 30) {
                return chalk.red('Last name has to be between 2 to 30 characters! Press Ctrl-C to cancel');
            }
            return true;
        }

    },
    {
        type: "list",
        name: "rolename",
        message: chalk.greenBright("Please enter what would be their Role:"),
        choices: dataset.rolesArray,
        when(answer) {
            return answer.firstname.length != 0 && answer.lastname.length != 0;
        },
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide a valid Role! Press Ctrl-C to cancel');
            }
            return true;
        }

    },
    {
        type: "list",
        name: "manager",
        message: chalk.greenBright("Who will be their manager?:"),
        choices: dataset.employeeArray,
        when(answer) {
            return dataset.employeeArray.length != 0;
        },
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide Managers Name! Press Ctrl-C to cancel');
            }
            return true;
        }

    }
]

function isNumeric(input) {
    return /^[0-9]+(\.[0-9]+)?$/.test(input);
}

module.exports = { action, department, roles, employee, updateEmployee, updateRole }