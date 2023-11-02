/****************************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 11/1/2023 10:11:57 PM
 * 
 * Description :
 * This file contains sql statements used throughout the application.
 * These queries are standard queries with no parameters. Those type
 * of queries are taken care when needed.
 *****************************************************************************/
const db = require("../utils/connect");
const chalk = require("chalk");
const format = require("../helpers/formatter");

/**
 * This function will validate the CMS database exists or not. This is critical as we cannot continue if there
 * is no database created and seeded
 * @param {string} value - Database name
 * @returns 
 */
async function validateDB(value) {
    const connection = await db.validatedatabase(); // Get connection to database

    const [rows, fields] = await connection.execute(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME="${value}"`);
    return { count: rows.length, rows };
}

/**
 * This function will execute the SQL statement passed in parameters
 * @param {string} value - SQL Statement to execute
 * @returns true/false
 */
async function executeSQL(value) {
    const connection = await db.validatedatabase(); // Get connection to database
    try {
        for (let x = 0; x <= value.length-1; x++) {

            if (value[x].length !== 0) {
                console.log(value[x] + `;`);
                await connection.execute(value[x]);
            }
        }
        return true;

    } catch (error) {
        format.messagelogger(chalk.red('Error retrieving data:'), error);
        return false;
    } finally {
        connection.end(); // Close the database connection when done
    }
}


/**
 * This function will execute the SQL statement passed in parameters
 * @param {string} value - SQL Statement to execute
 * @returns true/false
 */
async function runQuery(value) {
    const connection = await db.database(); // Get connection to database
    try {
        for (let x = 0; x <= value.length-1; x++) {
            
            if (value[x].length !== 0) {
                console.log(value[x] + `;`);
                await connection.query(value[x]);
            }
        }
        return true;

    } catch (error) {
        format.messagelogger(chalk.red('Error retrieving data:'), error);
        return false;
    } finally {
        connection.end(); // Close the database connection when done
    }
}

module.exports = { validateDB, executeSQL, runQuery }