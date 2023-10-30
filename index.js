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
const sSchema = fs.readFileSync("./db/schema.sql", "utf8");

let questions = require("./utils/questions");
const dataset = require("./utils/data");
const format = require("./helpers/formatter");
const dic = require("./db/queries");

function headerslog(value) {
    if (value === undefined) {
        console.log("");
        return;
    }
    console.log("");
    console.log(value);
    return;
}

/**
 * Entry point for the application. Inquire questionnaire will continue until
 * the users selects to finish or cancels nodejs executions. Most of the logic happens here.
 * We use te data to retrieve information form database
 */
async function init() {
    let exit = false;
    let response;
    let responseinquirer;
    let sSql = dic.managers;

    process.stdout.write("\x1Bc");
    // for (var x=1; x<30; x++){
    //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // }

    while (!exit) {
        const answer = await inquirer.prompt(questions.operations);

        switch (answer.actionperform) {
            case "\u001b[31mDelete Data\u001b[39m":
                await dataset.loadArray(questions, dic.departments, "departments", "Go back");
                await dataset.loadArray(questions, dic.roles, "rolesarray", "Go back");
                await dataset.loadArray(questions, dic.employees, "employeesall", "Go back");

                responseinquirer = await inquirer.prompt(questions.deletedata);
                console.log(responseinquirer);

                switch (responseinquirer.actionperform) {
                    case "Delete Departments":                        
                        sSql = dic.empbymanager 
                        response = await dataset.getTable(sSql);
                        break;
                    case "Delete Roles":
                        sSql = dic.empbymanager
                        response = await dataset.getTable(sSql);
                        break;
                    case "Delete Employees":
                        break;
                    case "Exit":
                        break;
                }
                break;

            case "\u001b[32mView Data\u001b[39m":
                await dataset.loadArray(questions, dic.managers, "managers", "Go Back");
                responseinquirer = await inquirer.prompt(questions.viewdata);

                switch (responseinquirer.actionperform) {
                    case "Employees by Managers (ALL)":
                        sSql = dic.empbymanager + ` order by Manager, id`
                        response = await dataset.getTable(sSql);
                        headerslog(`List of ALL Employees order by management`)

                        // Format Employees by Manager header
                        console.log(chalk.bgCyan(`${format.resize("Manager", 25)} ${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role ID", 5)} ${format.resize("Role Title", 25)}`));

                        for (const row of response.rows) {
                            console.log(`${format.resize(row.Manager, 25)} ${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.role_id, 5)} ${format.resize(row.title, 25)}`);
                        }
                        headerslog();
                        break;

                    case "Employees by Manager":
                        if (responseinquirer.managername != "Go Back") {
                            sSql = dic.empbymanager + ` WHERE Manager="${responseinquirer.managername}" ORDER BY id;`
                            response = await dataset.getTable(sSql);
                            headerslog(`List of Employees under management of ${responseinquirer.managername}`)

                            // Format Employees by Manager header
                            console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role ID", 5)} ${format.resize("Role Title", 25)}`));

                            for (const row of response.rows) {
                                console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.role_id, 5)} ${format.resize(row.title, 25)}`);
                            }
                            headerslog();
                        }
                        break;

                    case "Employees by Department":
                        sSql = dic.empbydepartment;
                        response = await dataset.getTable(sSql);
                        headerslog(`List of Employees by Department`)

                        // Format Employees by Manager header
                        console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Department", 30)} ${format.resize("Fullname", 25)} ${format.resize("Title", 40)} ${format.resize("Salary", 25)}`));

                        let departmentId = 0;
                        for (const row of response.rows) {
                            console.log(`${format.resize(row.DepartmentID.toString(), 5)} ${format.resize(row.name, 30)} ${format.resize(row.Fullname, 25)} ${format.resize(row.title, 40)} ${format.money(row.salary)}`);
                        }
                        headerslog();
                        break;

                    case "Departments Budget":
                        sSql = dic.departmentbudget + ` order by id`;
                        response = await dataset.getTable(sSql);
                        headerslog(`Departments budget`)

                        // Format Employees by Manager header
                        console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Department", 30)} ${format.resize("Budget", 25)}`));
                        for (const row of response.rows) {
                            console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.name, 30)} ${format.money(row.budget)}`);
                        }
                        headerslog();
                        break;

                    case "Exit":
                }
                break;

            case "View All Employees":
                const dsEmployee = await dataset.getTable(dic.employees);

                if (dsEmployee.count == 0) {
                    format.nodata("No Records found in the Employee's table");
                } else {
                    headerslog("Information from Employees Table");

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
                const dsRoles = await dataset.getTable(dic.allroles);
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
                await dataset.loadArray(questions, dic.departments, "departments");
                const rolesresponse = await inquirer.prompt(questions.roles);
                await dataset.loadArray(questions, dic.roles, "roles");
                console.log(response);
                break;

            case "Add an Employee":
                await dataset.loadArray(questions, dic.roles, "roles");
                await dataset.loadArray(questions, dic.departments, "departments");

                const employeeresponse = await inquirer.prompt(questions.employee);
                response = await dataset.addEmployee(employeeresponse);
                console.log(response);
                break;

            case "Update an Employee Role":
                await dataset.loadArray(questions, dic.allemployees, "employees");
                const usereesponse = await inquirer.prompt(questions.updateEmployee);

                resultArr = await dataset.loadRoles(questions, usereesponse);
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

            default:
                break;
        }
    }
}

init().catch((error) => console.error(error));

