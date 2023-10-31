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

let deleteConfirm = "Are you sure you want to proceed?";

const actionlist = [

    "View All Employees",
    "View All Departments",
    "View All Roles",
    "Add a Department",
    "Add a Role",
    "Add an Employee",
    "Update an Employee Role",
    chalk.green("View Data"),
    chalk.red("Delete Data"),
    "Finish",
    "Clear Terminal"
]

let departmentsArray = [];
let rolesArray = [];
let employeeArray = [];
let managersArray = [];

let hours = new Date().getHours();
hours = (hours + 24 - 2) % 24;
const ampm = (hours >= 12) ? "afternoon," : "morning,";

const viewdata = [
    {
        type: 'list',
        name: 'actionperform',
        message: chalk.blue(`What information would you like to see?`),
        choices: [
            "Employees by Manager",
            "Employees by Managers (ALL)",
            "Employees by Department",
            "Departments Budget",
            "Exit"
        ]
    },
    {
        type: "list",
        name: "managername",
        message: chalk.magenta("Please select Manager from List:"),
        when(answer) {
            return answer.actionperform === "Employees by Manager";
        },
        choices: managersArray
    }
]

const deletedata = [
    {
        type: 'list',
        pageSize: 12,
        name: 'actionperform',
        message: chalk.blue(`From where you want to delete data?`),
        choices: [
            "Delete Departments",
            "Delete Roles",
            "Delete Employees",
            "Exit"
        ]
    },
    {
        type: "list",
        name: "deletedKey",
        pageSize: 20,
        message: chalk.magenta("Please select Role to delete!"),
        when(answer) {
            return answer.actionperform === "Delete Roles";
        },
        choices: rolesArray
    },
    {
        type: "list",
        name: "deletedKey",
        pageSize: 12,
        message: chalk.magenta("Please select Department to delete:"),
        when(answer) {
            return answer.actionperform === "Delete Departments";
        },
        choices: departmentsArray
    },
    {
        type: "list",
        name: "deletedKey",
        pageSize: 20,
        message: chalk.magenta("Please select Employee to delete:"),
        when(answer) { 
            return answer.actionperform === "Delete Employees";
        },
        choices: employeeArray
    }
]

const operations = [
    {
        type: 'list',
        pageSize: 12,
        name: 'actionperform',
        message: chalk.blue(`Good ${ampm} what would you like to do today?`),
        choices: actionlist,
        default: "View All Employees"
    }
]

const updateEmployee = [
    {
        type: 'list',
        name: 'updateemployee',
        pageSize: 15,
        message: chalk.cyanBright(`Select the Employee you like to update?`),
        choices: employeeArray
    }
]

const updateRole = [
    {
        type: 'list',
        name: 'updaterole',
        pageSize: 25,
        message: chalk.cyanBright(`Select the new Role for the selected Employee?`),
        choices: rolesArray
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

const roleactions = [
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
        choices: departmentsArray,
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
        choices: rolesArray,
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
        choices: employeeArray,
        when(answer) {
            return employeeArray.length != 0;
        },
        validate(answer) {
            if (answer.length == 0) {
                return chalk.red('You must provide Managers Name! Press Ctrl-C to cancel');
            }
            return true;
        }

    }
]

const yesnoConfirm = [
    {
        type: "confirm",
        name: "confirmdelete",
        message: chalk.red(deleteConfirm),
    }
]

function isNumeric(input) {
    return /^[0-9]+(\.[0-9]+)?$/.test(input);
}

module.exports = { operations, department, roleactions, employee, updateEmployee, updateRole, viewdata, deletedata, departmentsArray, managersArray, rolesArray, employeeArray, yesnoConfirm, deleteConfirm }