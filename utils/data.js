/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 *******************************************************************/
const db = require("./connect");
const chalk = require("chalk");

/**
 * This function will load inforation from a given table. It is meant to be reused
 * in some of the options that require a simple query from a single table.
 * @param {string} value - SQL Statement in some cases
 * @returns Table object
 */
async function getTable(value) {
    const connection = await db.database(); // Get connection to database

    try {

        if (value.indexOf("SELECT") >= 0 || value.indexOf("select") >= 0) {
            const [rows, fields] = await connection.execute(value);
            return { count: rows.length, rows };
        } else {
            const [rows, fields] = await connection.execute(`SELECT * FROM ${value} order by id`);
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
 * @returns Message string
 */
async function addDepartment(name) {
    const connection = await db.database(); // Get connection to database

    try {
        const [rows, fields] = await connection.execute(`SELECT * FROM department WHERE name="${name}"`);

        if (rows.length != 0) {
            return chalk.bgRed(`Department ${name} (ID:${rows[0].id}) already exists!`);
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

/**
 * This function will execute the SQL statement passed in parameters
 * @param {string} value - SQL Statement to execute
 * @returns 
 */
async function executeSQL(value) {
    const connection = await db.database(); // Get connection to database
    try {
        await connection.execute(value);
        return chalk.green(`Process completed!`);
    } catch {
        console.error(chalk.red('Error retrieving data:', error));
    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This method will split the employee name passed and retrieve the user in the employee
 * table to return the employee id
 * @param {string} value - fullname to seek
 * @param {object} ocnn - database connection object
 * @returns Employee ID
 */
async function getId(value, ocnn) {
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
    const connection = await db.database(); // Get connection to database

    try {
        let sSql = `SELECT id FROM employee WHERE first_name="${value.firstname}" AND last_name="${value.lastname}"`
        let [rows, fields] = await connection.execute(sSql);

        if (rows.length != 0) {
            return chalk.bgRed(`Employee ${value.firstname} ${value.lastname} (ID:${rows[0].id}) already exists!`);
        } else {

            if (value.manager !== undefined && value.manager !== "No Manager") {
                const ManagerId = await getId(value);// Retrieve managers ID

                const roleSql = `SELECT id FROM role WHERE title="${value.rolename}"`;// Retrieves Role ID
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
            return chalk.bgGreen(`Employee ${value.firstname} ${value.lastname} has been added!`);
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
    const connection = await db.database(); // Get connection to database

    try {
        let sSql = `SELECT id FROM role ` +
            `WHERE title="${value.rolename}" AND ` +
            `department_id=(SELECT id FROM department WHERE name="${value.department}");`
        const [rows, fields] = await connection.execute(sSql);

        if (rows.length != 0) {
            return chalk.bgRed(`Role ${value.rolename} (ID:${rows[0].id}) already exists in ${value.department}!`);
        } else {
            sSql = `INSERT INTO role (title, salary, department_id) VALUES` +
                `("${value.rolename}",${value.salary},(SELECT id FROM department WHERE name="${value.department}"));`

            await connection.execute(sSql); // Executes the SQL Command - it does not return any value
            return chalk.green(`The role ${value.rolename} has been added to ${value.department}!`);
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
 * @param {string} emp - employee name
 * @param {string} role - role name
 * @returns 
 */
async function updateEmployee(emp, role) {
    const connection = await db.database(); // Get connection to database

    try {
        const ManagerId = await getId(emp.updateemployee, connection);

        sSql = `UPDATE employee SET role_id=(SELECT id FROM role WHERE title="${role.updaterole}") WHERE id=${ManagerId};`

        await connection.execute(sSql);
        return chalk.bgCyanBright(`The Employee role has been added udated!`);

    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

async function updateEmployeeManager(emp, manager) {
    const connection = await db.database(); // Get connection to database

    try {
        const EmployeeId = await getId(emp.updateemployee, connection);
        const ManagerId = await getId(manager.reportmanager, connection);
        
        sSql = `UPDATE employee SET manager_id=${ManagerId} where id=${EmployeeId}`

        await connection.execute(sSql);
        return chalk.bgCyanBright(`The Employee Reporting Manager has been added udated!`);

    } catch (error) {
        console.error(chalk.red('Error retrieving data:', error));

    } finally {
        connection.end(); // Close the database connection when done
    }
}

/**
 * This asynchronous function will load information into arrays which are in the q
 * uestions utility to be used by the inquirer.prompt.
 * @param {object} questions - questions object received form the index
 * @param {string} sql - SQL Statement 
 * @param {string} arrname  - Array to update
 * @param {string} additional - additional row to add.
 */
async function loadArray(questions, sql, arrname, additional) {
    const connection = await db.database(); // Get connection to database
    const [rows, fields] = await connection.execute(sql);

    for (const row of rows) {

        switch (arrname) {
            case "managers":
                questions.managersArray.push(row.Manager);
                break;
            case "departments":
                questions.departmentsArray.push(row.name);
                break;
            case "rolesarray":
                questions.rolesArray.push(row.name);
                break;
            case "employeesall":
                questions.employeeArray.push(row.name);
                break;
            case "employees":
                questions.employeeArray.push(row.Fullname);
                break;
        }
    }

    if (additional !== undefined) {
        switch (arrname) {
            case "managers":
                questions.managersArray.push(additional);
                break;
            case "departments":
                questions.departmentsArray.push(additional);
                break;
            case "rolesarray":
                questions.rolesArray.push(additional);
                break;
            case "employeesall":
                questions.employeeArray.push(additional);
                break;
            case "employees":
                questions.employeeArray.push(additional);
                break;
        }
    }
}

/**
 * This asynchronous function will retrieve all records from roles table and add them into
 * the array which used in the questionnaire (inquire). The function receives a paramete but 
 * it may not ba available. In case there isn't any parameter a simple query form the roles is 
 * created.
 * @param {object} questions - questions object received form the index
 * @param {string} value - conditionals
 */
async function loadRoles(questions, value) {
    const connection = await db.database(); // Get connection to database

    if (value === undefined) {
        const [rows, fields] = await connection.execute("SELECT title FROM role");
        for (const row of rows) {
            questions.rolesArray.push(row.title);
        }
    } else {
        const splitName = value.updateemployee.split(' ');
        const [rows, fields] = await connection.execute(`SELECT title FROM role WHERE id<>(SELECT role_id FROM employee ` +
            `WHERE first_name="${splitName[0]}" AND last_name="${splitName[1]}") order by title;`);
        for (const row of rows) {
            questions.rolesArray.push(row.title);
        }
    }
}

module.exports = { getTable, addDepartment, addRole, loadRoles, addEmployee, updateEmployee, loadArray, executeSQL, updateEmployeeManager };