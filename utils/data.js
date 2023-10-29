/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 *******************************************************************/
const mysql = require("mysql2");
const db = require("./connect");
const chalk = require("chalk");

const departmentsArray = [];
const rolesArray = [];
const employeeArray = [];

/**
 * This functio will load inforation from a given table. It is meant to be reused
 * in some of the options that require a simple query from a single table.
 * @param {string} value - SQL Statement in some cases
 * @returns 
 */
async function getTable(value) {
    const connection = await db();

    try {

        if (value.indexOf("SELECT") >= 0) {
            const [rows, fields] = await connection.execute(value);
            return { count: rows.length, rows };
        } else {
            const [rows, fields] = await connection.execute(`SELECT * FROM ${value}`);
            return { count: rows.length, rows };
        }

    } catch (error) {
        console.error('Error retrieving data:', error);

    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This function will retrieve information from the department - filtering the table to match
 * conditiona passed in parameter
 * @param {string} name - department name
 * @returns 
 */
async function addDepartment(name) {
    const connection = await db();

    try {
        const [rows, fields] = await connection.execute(`SELECT * FROM department WHERE name="${name}"`);

        if (rows.length != 0) {
            return chalk.bgRed(`Department ${name} (ID:${rows[0].id}) already exists!\n`);
        } else {
            await connection.execute(`INSERT INTO department (name) VALUES ("${name}")`);
            return chalk.green(`Department ${name} has been added!`);
        }
    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

async function getId(value, ocnn){
    const splitName = value.split(' ');

    // Retrieve managers ID
    const ManagerSql = `SELECT id FROM employee WHERE first_name="${splitName[0]}" AND last_name="${splitName[1]}"`;
    [rows, fields] = await ocnn.execute(ManagerSql);
    return rows[0].id;
}

/**
 * This method will retrieve information from the Employee table. It also load a number of codes 
 * such as Managers ID and roles ID. It validate the user does not exists already
 * @param {object} value - inquirer object with selections
 * @returns 
 */
async function addEmployee(value) {
    const connection = await db();

    try {
        let sSql = `SELECT id FROM employee WHERE first_name="${value.firstname}" AND last_name="${value.lastname}"`
        let [rows, fields] = await connection.execute(sSql);

        if (rows.length != 0) {
            return chalk.bgRed(`Employee ${value.firstname} ${value.lastname} (ID:${rows[0].id}) already exists!\n`);
        } else {

            if (value.manager !== undefined && value.manager !== "No Manager") {
                // const splitName = value.manager.split(' ');

                // // Retrieve managers ID
                // const ManagerSql = `SELECT id FROM employee WHERE first_name="${splitName[0]}" AND last_name="${splitName[1]}"`;
                // [rows, fields] = await connection.execute(ManagerSql);
                const ManagerId = await getId(value);

                // Retrieves Role ID
                const roleSql = `SELECT id FROM role WHERE title="${value.rolename}"`;
                [rows, fields] = await connection.execute(roleSql);
                const RoleId = rows[0].id;

                // Builds INSERT SQL statement to run
                sSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ` +
                    `("${value.firstname}", "${value.lastname}", ${RoleId}, ${ManagerId});`
            } else {
                sSql = `INSERT INTO employee (first_name, last_name, role_id) VALUES ` +
                    `("${value.firstname}", "${value.lastname}", ());`
            }

            await connection.execute(sSql); // Executes the SQL Command - it does not return any value
            return chalk.bgGreen(`Employee ${value.firstname} ${value.lastname} has been added!\n`);
        }
    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This method will retrieve information from the Roles table. It validate the user does not exists already
 * @param {object} value - inquirer object with selections
 * @returns 
 */
async function addRole(value) {
    const connection = await db();

    try {
        let sSql = `SELECT id FROM role ` +
            `WHERE title="${value.rolename}" AND ` +
            `department_id=(SELECT id FROM department WHERE name="${value.department}");`
        const [rows, fields] = await connection.execute(sSql);

        if (rows.length != 0) {
            return chalk.bgRed(`Role ${value.rolename} (ID:${rows[0].id}) already exists in ${value.department}!\n`);
        } else {
            sSql = `INSERT INTO role (title, salary, department_id) VALUES` +
                `("${value.rolename}",${value.salary},(SELECT id FROM department WHERE name="${value.department}"));`

            await connection.execute(sSql); // Executes the SQL Command - it does not return any value
            return chalk.green(`The role ${value.rolename} has been added to ${value.department}!\n`);
        }
    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This method will update employees role information already assigned to user. The roles array have already been
 * filtered to exclude the role assigne currently to the user
 * @param {object} value - inquirer object with selections
 * @returns 
 */
async function updateEmployee(emp, role) {
    const connection = await db();

    try {
        const ManagerId = await getId(emp.updateemployee, connection);

        sSql = `UPDATE employee SET role_id=(SELECT id FROM role WHERE title="${role.updaterole}") WHERE id=${ManagerId};`

        await connection.execute(sSql);
        return chalk.bgCyanBright(`The user role has been added udated!\n`);

    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This asynchronous function will retrieve all records from department and add them into
 * the array which used in the questionnaire (inquire)
 */
async function loadDepartments() {
    const connection = await db();

    const [rows, fields] = await connection.execute("SELECT name FROM department");
    for (const row of rows) {
        departmentsArray.push(row.name);
    }
}

/**
 * This asynchronous function will retrieve all records from roles table and add them into
 * the array which used in the questionnaire (inquire). The function receives a paramete but 
 * it may not ba available. In case there isn't any parameter a simple query form the roles is 
 * created.
 */
async function loadRoles(value) {
    const connection = await db();

    if (value === undefined) {
        const [rows, fields] = await connection.execute("SELECT title FROM role");
        for (const row of rows) {
            rolesArray.push(row.title);
        }
    } else {
        const splitName = value.updateemployee.split(' ');
        const [rows, fields] = await connection.execute(`SELECT title FROM role WHERE id<>(SELECT role_id FROM employee ` +
            `WHERE first_name="${splitName[0]}" AND last_name="${splitName[1]}");`);
        for (const row of rows) {
            rolesArray.push(row.title);
        }
    }
}

/**
 * This asynchronous function will retrieve all records from employees table  and add them into
 * the array which used in the questionnaire (inquire). Notice tha we concatenating the 
 * first + last name
 */
async function loadEmployees() {
    const connection = await db();

    employeeArray.push("No Manager")
    const [rows, fields] = await connection.execute(`SELECT CONCAT_WS( " ", first_name, last_name ) as Fullname FROM employee;`);
    for (const row of rows) {
        employeeArray.push(row.Fullname);
    }
}

module.exports = { getTable, addDepartment, addRole, departmentsArray, loadDepartments, rolesArray, loadRoles, addEmployee, employeeArray, loadEmployees, updateEmployee };