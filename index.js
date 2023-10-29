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
const chalk = require("chalk");

// fs is a Node standard library package for reading and writing files
const fs = require("fs");

// The fs.readFileSync() method is an inbuilt application programming interface of 
// the fs module which is used to read the file and return its content. 
// https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
const sSql = fs.readFileSync("./db/schema.sql", "utf8");

const questions = require("./utils/questions");
const connectDb = require("./utils/connect");
const dataset = require("./utils/data");
const format = require("./helpers/formatter");

/**
 * Entry point for the application. Inquire questionnaire will continue until
 * the users selects to finish or cancels nodejs executions. Most of the logic happens here.
 * We use te data to retrieve information form database
 */
async function init() {
    let exit = false;
    let response;
    let resultArr;

    process.stdout.write("\x1Bc");

    while (!exit) {
        const answer = await inquirer.prompt(questions.action);

        switch (answer.actionperform) {
            case "View All Employees":

                // Complex Query - using CONCAT_WS to joing two string together.
                // This function in MySQL helps in joining two or more strings along with a separator. The separator 
                // must be specified by the user and it can also be a string. If the separator is NULL, then the 
                // result will also be NULL. https://www.geeksforgeeks.org/concat_ws-function-in-mysql/
                const sEmpSql = `SELECT E.id, CONCAT_WS( " ", E.first_name, E.last_name ) as Fullname, r.title, d.name, r.salary, CASE WHEN ISNULL(M.first_name) THEN "No Manager" ELSE CONCAT_WS( " ", M.first_name, M.last_name ) END AS Manager FROM employee E JOIN role R ON R.id=E.role_id JOIN department D ON D.id=R.department_id LEFT JOIN employee M ON M.id=E.manager_id`
                const dsEmployee = await dataset.getTable(sEmpSql);

                if (dsEmployee.count == 0) {
                    format.nodata("No Records found in the Employee's table");
                } else {
                    console.log("Information from Employees Table");
                    console.log("");
                    
                    // Format table header
                    console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role Title", 30)} ${format.resize("Department Name", 30)} ${format.resize("Salary", 12)} ${format.resize("Manager", 25)}`));

                    for (const row of dsEmployee.rows) {
                        console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.title, 30)} ${format.resize(row.name, 30)} ${format.money(row.salary)}   ${format.resize(row.Manager, 25)}`);
                    }
                    console.log("");
                }
                break;

            case "View All Departments":
                const dsDepartment = await dataset.getTable("department");
                if (dsDepartment.count == 0) {
                    format.nodata("No Records found in the Department's table");
                } else {
                    console.log("Information from Department Table");
                    console.log("");

                    // Format table header - yello background
                    console.log(chalk.yellow(`${format.resize("ID", 5)} ${format.resize("Department Name", 50)}`));
                    for (const row of dsDepartment.rows) {
                        console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.name, 50)}`);
                    }
                    console.log("");
                }
                break;

            case "View All Roles":
                const sSql = `SELECT R.title, R.id, D.name, R.salary FROM role R JOIN department D ON D.id=R.department_id`
                const dsRoles = await dataset.getTable(sSql);
                if (dsRoles.count == 0) {
                    format.nodata("No Records found in the Roles table");
                } else {
                    console.log("Information from Roles Table");
                    console.log("")

                    // Format table header - blue background
                    console.log(chalk.blueBright(`${format.resize("Role Tile", 40)} ${format.resize("ID", 5)} ${format.resize("Department Name", 30)} ${format.resize("Salary", 15)}`));
                    for (const row of dsRoles.rows) {
                        console.log(`${format.resize(row.title, 40)} ${format.resize(row.id.toString(), 5)} ${format.resize(row.name, 30)} ${format.money(row.salary)}`);
                    }
                    console.log(chalk.bgCyan(`Total Roles ${format.resize(dsRoles.count.toString() + " records", 70)} ${". "}\n`));
                }
                break;

            case "Add a Department":
                const departmentresponse = await inquirer.prompt(questions.department);
                response = await dataset.addDepartment(departmentresponse.department);
                console.log(response);
                break;

            case "Add a Role":
                resultArr = await dataset.loadDepartments();
                const rolesresponse = await inquirer.prompt(questions.roles);
                response = await dataset.addRole(rolesresponse);
                console.log(response);
                break;

            case "Add an Employee":
                resultArr = await dataset.loadRoles();
                resultArr = await dataset.loadEmployees();

                const employeeresponse = await inquirer.prompt(questions.employee);
                response = await dataset.addEmployee(employeeresponse);
                console.log(response);
                break;

            case "Update an Employee Role":
                resultArr = await dataset.loadEmployees();
                const usereesponse = await inquirer.prompt(questions.updateEmployee);

                resultArr = await dataset.loadRoles(usereesponse);
                const roleupdate = await inquirer.prompt(questions.updateRole);
                response = await dataset.updateEmployee(usereesponse, roleupdate);
                console.log(response);
                break;

            case "Finish":
                process.stdout.write("\x1Bc");
                console.log("Thank you for participating!")
                exit = true;
                break;

            case "Clear Terminal":
                process.stdout.write("\x1Bc");
                break;
        }
    }
}

init().catch((error) => console.error(error));

