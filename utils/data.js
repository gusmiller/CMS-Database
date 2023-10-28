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

const departmentsArray = []

async function getTable(value) {
    const connection = await db();

    try {

        const [rows, fields] = await connection.execute(`SELECT * FROM ${value}`);
        return { count: rows.length, rows };

    } catch (error) {
        console.error('Error retrieving data:', error);

    } finally {
        connection.end(); // Close the database connection when done
    }
}

async function loadDepartments(){
    const connection = await db();

    const [rows, fields] = await connection.execute("SELECT name FROM department");
    for (const row of rows) {
        departmentsArray.push(row.name);
    }

}

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

            await connection.execute(sSql);
            return chalk.green(`The role ${value.rolename} has been added to ${value.department}!\n`);
        }
    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

async function test() {
    const connection = await db();
    
    try {
        const [rows, fields] = await connection.execute(`SELECT * FROM department`);
    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

module.exports = { getTable, addDepartment, addRole, departmentsArray, loadDepartments, test };