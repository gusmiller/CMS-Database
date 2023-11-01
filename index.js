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

    // Validate for chalk colors
    if (value.lastIndexOf("39m") || value.lastIndexOf("49m")) {
        let firstthree = value.substring(0, 5); // Retrieve the first 3 characters
        let lastfive = value.substring(value.length - 5); // Get the last portion

        let newvalue = value.substring(5); // Remove chalk characters
        newvalue = newvalue.slice(0, -5);
        const padding = " ".repeat(140 - newvalue.length); // Build the fixed length string
        console.log(firstthree + newvalue + padding + lastfive); // Put message all back togeher 
    } else {
        console.log(value);
    }

    console.log("");
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
    let sSql = dic.sql.managers;

    format.carletonlogo();

    while (!exit) {
        const answer = await inquirer.prompt(questions.operations);

        switch (answer.actionperform) {
            case "\u001b[31mDelete Data\u001b[39m":

                // Inquierer uses arrays for its options; we need to load this information dynamically,
                // it is possible that user added new data. Information cannot be harcoded.
                await dataset.loadArray(questions, dic.sql.departments, "departments", "Go back");
                await dataset.loadArray(questions, dic.sql.roles, "rolesarray", "Go back");
                await dataset.loadArray(questions, dic.sql.employeelist, "employeesall", "Go back");

                // Call inquirer and retrieve information from te user
                responseinquirer = await inquirer.prompt(questions.deletedata);
                let deletedId = 0;

                switch (responseinquirer.actionperform) {
                    case "Delete Departments":
                        deleteId = responseinquirer.deletedKey;
                        sSql = dic.sql.validatedepartment + ` where name="${responseinquirer.deletedKey}"`;
                        response = await dataset.getTable(sSql); // Retrieve data from table

                        if (response.count > 0) {
                            headerslog(dic.messages.departmentused); // Display message
                            responseinquirer = await inquirer.prompt(questions.yesnoConfirm);

                            // Validate the role is not already assigned. In case it is assigned then we will re-assign the 
                            // users to TBA role.
                            if (responseinquirer.confirmdelete) {
                                // SQL Statement to replace role already used. This is required or else the referential 
                                // integrity will fail. We cannot delete the key
                                let deleteSQL = dic.sql.replacerole.replace("param1", deleteId);
                                await dataset.executeSQL(deleteSQL);
                                await dataset.executeSQL(dic.sql.deleterole + `"${deleteId}"`)
                            }

                        } else {
                            response = await dataset.executeSQL(dic.sql.deletedepartment + ` where name="${deleteId}";`);
                        }

                        break;

                    case "Delete Roles":
                        deleteId = responseinquirer.deletedKey;
                        sSql = dic.sql.validaterole + `"${responseinquirer.deletedKey}"`;
                        response = await dataset.getTable(sSql); // Retrieve data from table

                        if (response.count > 0) {
                            headerslog(dic.messages.roleused);

                            // Call inquirer and retrieve information from te user
                            responseinquirer = await inquirer.prompt(questions.yesnoConfirm);

                            // Validate the role is not already assigned. In case it is assigned then we will re-assign the 
                            // users to TBA role.
                            if (responseinquirer.confirmdelete) {
                                // SQL Statement to replace role already used. This is required or else the referential 
                                // integrity will fail. We cannot delete the key
                                let deleteSQL = dic.sql.replacerole.replace("param1", deleteId);
                                await dataset.executeSQL(deleteSQL);
                                await dataset.executeSQL(dic.sql.deleterole + `"${deleteId}"`)
                            }

                        } else {
                            response = await dataset.executeSQL(dic.sql.validaterole + `${deleteId};`);
                        }
                        break;

                    case "Delete Employees":
                        const splitName = responseinquirer.deletedKey.split(' ');
                        sSql = dic.sql.getemployeeid + `first_name="${splitName[0]}" and last_name="${splitName[1]}";`;
                        response = await dataset.getTable(sSql); // Retrieve data from table
                        const employeeId = response.rows[0].id;

                        sSql = dic.sql.getemployeemanager + `${employeeId};`;
                        response = await dataset.getTable(sSql); // Retrieve data from table

                        if (response.count > 0) {
                            ssql = dic.sql.deleteemployee + `$`
                            await dataset.executeSQL();
                        }

                        await dataset.executeSQL(`delete from employee where id=${employeeId};`);
                        headerslog(dic.messages.employeebymanagers);
                        break;

                    case "Exit":
                        break;
                }
                break;

            case "\u001b[32mView Data\u001b[39m":
                await dataset.loadArray(questions, dic.sql.managers, "managers", "Go Back");

                // Call inquirer and retrieve information from te user
                responseinquirer = await inquirer.prompt(questions.viewdata);

                switch (responseinquirer.actionperform) {
                    case "Employees by Managers (ALL)":
                        sSql = dic.sql.empbymanager + ` order by Manager, id`
                        response = await dataset.getTable(sSql); // Retrieve data from table
                        headerslog(dic.messages.employeebymanagers)

                        // Format Employees by Manager header
                        console.log(chalk.bgCyan(`${format.resize("Manager", 25)} ${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role ID", 5)} ${format.resize("Role Title", 25)}`));

                        for (const row of response.rows) {
                            console.log(`${format.resize(row.Manager, 25)} ${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.role_id, 5)} ${format.resize(row.title, 25)}`);
                        }
                        headerslog();
                        break;

                    case "Employees by Manager":
                        if (responseinquirer.managername != "Go Back") {
                            sSql = dic.sql.empbymanager + ` WHERE Manager="${responseinquirer.managername}" ORDER BY id;`
                            response = await dataset.getTable(sSql); // Retrieve data from table
                            headerslog(chalk.bgWhite(`List of Employees under management of ${responseinquirer.managername}`))

                            // Format Employees by Manager header
                            console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role ID", 5)} ${format.resize("Role Title", 25)}`));

                            for (const row of response.rows) {
                                console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.role_id, 5)} ${format.resize(row.title, 25)}`);
                            }
                            headerslog();
                        }
                        break;

                    case "Employees by Department":
                        sSql = dic.sql.empbydepartment;
                        response = await dataset.getTable(sSql); // Retrieve data from table
                        headerslog(dic.messages.employeesbydepartment)

                        // Format Employees by Manager header
                        console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Department", 30)} ${format.resize("Fullname", 25)} ${format.resize("Title", 40)} ${format.resize("Salary", 25)}`));

                        let departmentId = 0;
                        for (const row of response.rows) {
                            console.log(`${format.resize(row.DepartmentID.toString(), 5)} ${format.resize(row.name, 30)} ${format.resize(row.Fullname, 25)} ${format.resize(row.title, 40)} ${format.money(row.salary)}`);
                        }
                        headerslog();
                        break;

                    case "Departments Budget":
                        sSql = dic.sql.departmentbudget + ` order by id`;
                        response = await dataset.getTable(sSql); // Retrieve data from table
                        headerslog(dic.messages.departmentsbudget)

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
                const dsEmployee = await dataset.getTable(dic.sql.employees); // Retrieve data from table

                if (dsEmployee.count == 0) {
                    format.nodata(dic.messages.viewallemployeesnodata);
                } else {
                    headerslog(dic.messages.viewallemployees);

                    // Format table header
                    console.log(chalk.bgCyan(`${format.resize("ID", 5)} ${format.resize("Fullname", 25)} ${format.resize("Role Title", 30)} ${format.resize("Department Name", 30)} ${format.resize("Manager", 25)} ${format.resize("Salary", 12)}`));

                    for (const row of dsEmployee.rows) {
                        console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.Fullname, 25)} ${format.resize(row.title, 30)} ${format.resize(row.name, 30)} ${format.resize(row.Manager, 25)} ${format.money(row.salary)}`);
                    }
                    console.log("");
                }
                break;

            case "View All Departments":
                const dsDepartment = await dataset.getTable("department"); // Retrieve data from table
                if (dsDepartment.count == 0) {
                    format.nodata(dic.messages.viewalldepartmentsnodata);
                } else {
                    headerslog(dic.messages.viewalldepartments);

                    // Format table header - yello background
                    console.log(chalk.yellow(`${format.resize("ID", 5)} ${format.resize("Department Name", 50)}`));
                    for (const row of dsDepartment.rows) {
                        console.log(`${format.resize(row.id.toString(), 5)} ${format.resize(row.name, 50)}`);
                    }
                    console.log("");
                }
                break;

            case "View All Roles":
                const dsRoles = await dataset.getTable(dic.sql.allroles); // Retrieve data from table

                if (dsRoles.count == 0) {
                    format.nodata(dic.messages.viewallrolesnodata);
                } else {
                    headerslog(dic.messages.viewallroles);

                    // Format table header - blue background
                    console.log(chalk.bgCyan(`${format.resize("Role Tile", 40)} ${format.resize("ID", 5)} ${format.resize("Department Name", 30)} ${format.resize("Salary", 15)}`));
                    for (const row of dsRoles.rows) {
                        console.log(`${format.resize(row.title, 40)} ${format.resize(row.id.toString(), 5)} ${format.resize(row.name, 30)} ${format.money(row.salary)}`);
                    }
                    console.log(chalk.bgCyan(`Total Roles ${format.resize(dsRoles.count.toString() + " records", 70)} ${". "}\n`));
                }
                break;

            case "Add a Department":
                headerslog(dic.messages.addingdepartment);

                // Call inquirer and retrieve information from te user
                responseinquirer = await inquirer.prompt(questions.department);

                // Validate user has not cancelled request
                if (responseinquirer.department !== "Cancel" && responseinquirer.department !== "cancel") {
                    response = await dataset.addDepartment(responseinquirer.department);
                    console.log(response);
                } else {
                    headerslog(dic.messages.requestcanceled); // Request was cancelled by user
                }

                break;

            case "Add a Role":
                headerslog(dic.messages.addingroles);
                await dataset.loadArray(questions, dic.sql.departments, "departments");

                // Call inquirer and retrieve information from te user
                responseinquirer = await inquirer.prompt(questions.roleactions);

                // Validate user has not cancelled request
                if (responseinquirer.rolename !== "Cancel" && responseinquirer.rolename !== "cancel") {
                    response = await dataset.addRole(responseinquirer.rolename);
                    console.log(response);
                } else {
                    headerslog(dic.messages.requestcanceled); // Request was cancelled by user
                }
                break;

            case "Add an Employee":
                headerslog(dic.messages.addingemployee);
                await dataset.loadArray(questions, dic.sql.roles, "roles");
                await dataset.loadArray(questions, dic.sql.departments, "departments");

                // Call inquirer and retrieve information from te user
                const employeeresponse = await inquirer.prompt(questions.employee);

                // Validate user has not cancelled request
                if (employeeresponse.firstname !== "Cancel" && employeeresponse.firstname !== "cancel") {
                    response = await dataset.addEmployee(employeeresponse);
                    console.log(response);
                } else {
                    headerslog(dic.messages.requestcanceled); // Request was cancelled by user
                }
                break;

            case "Update an Employee Role":
                await dataset.loadArray(questions, dic.sql.allemployees, "employees", "Cancel");

                // Call inquirer and retrieve information from te user
                const usereesponse = await inquirer.prompt(questions.updateEmployee);

                // Validate user has not cancelled request. Note that this one differs from other validations
                if (usereesponse.updateemployee !== "Cancel") {

                    resultArr = await dataset.loadRoles(questions, usereesponse);
                    questions.rolesArray.push("Cancel");

                    // Call inquirer and retrieve information from te user
                    const roleupdate = await inquirer.prompt(questions.updateRole);

                    // Validate user has not cancelled request. Note that this one is different than others
                    if (roleupdate.updaterole !== "Cancel") {
                        response = await dataset.updateEmployee(usereesponse, roleupdate);
                        console.log(response);
                    } else {
                        headerslog(dic.messages.requestcanceled); // Request was cancelled by user
                    }
                } else {
                    headerslog(dic.messages.requestcanceled); // Request was cancelled by user
                }
                break;

            case "Finish":
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

