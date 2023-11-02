/****************************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/29/2023 4:52:10 PM
 * 
 * Description :
 * This file contains sql statements used throughout the application.
 * These queries are standard queries with no parameters. Those type
 * of queries are taken care when needed.
 * 
 * employees: Complex Query - using CONCAT_WS to joing two string together.
 * This function in MySQL helps in joining two or more strings along 
 * with a separator. The separator must be specified by the user and it 
 * can also be a string. If the separator is NULL, then the result will
 * also be NULL. https://www.geeksforgeeks.org/concat_ws-function-in-mysql/
 *****************************************************************************/
const chalk = require("chalk");

const sql = {
    managers: 'select * from (select concat_ws(" ", first_name, last_name) as Manager from employee join role on employee.role_id=role.id where title like "%manager%") as data order by Manager;',
    departments: `SELECT id as value, name FROM department order by name;`,
    roles: `SELECT id as value, title as name FROM role order by title;`,
    allroles: `SELECT R.title, R.id, D.name, R.salary FROM role R JOIN department D ON D.id=R.department_id`,
    employeelist: `SELECT id as value, CONCAT_WS( " ", first_name, last_name ) as name from employee`,
    employees: `SELECT E.id, CONCAT_WS( " ", E.first_name, E.last_name ) as Fullname, r.title, d.name, r.salary, CASE WHEN ISNULL(M.first_name) THEN "No Manager" ELSE CONCAT_WS( " ", M.first_name, M.last_name ) END AS Manager FROM employee E JOIN role R ON R.id=E.role_id JOIN department D ON D.id=R.department_id LEFT JOIN employee M ON M.id=E.manager_id`,
    empbymanager: `select concat_ws(" ", first_name, last_name) as Fullname, data.* from (select e.*, role.title, (select concat_ws(" ", first_name, last_name) from employee where id=e.manager_id) as Manager from employee e join role on e.role_id=role.id where not e.manager_id is null) as data`,
    empbydepartment: `select d.id as DepartmentID, d.name, e.id, concat_ws(" ", first_name, last_name) as Fullname, r.title, r.salary from employee as e join role as r on r.id=e.role_id join department as d on d.id=r.department_id order by d.id, e.id`,
    departmentbudget: `select d.id, d.name, SUM(r.salary) as budget from employee as e join role as r on r.id=e.role_id join department as d on d.id=r.department_id group by d.id, d.name`,
    allemployees: `SELECT CONCAT_WS( " ", first_name, last_name ) as Fullname FROM employee order by Fullname;`,
    validaterole: `select Count(employee.id) EmployeeId from role left join employee on role.id=employee.role_id where title=`,
    deleterole: `delete from role where title=`,
    replacerole: `update employee set role_id=(select id from role where title="TBA") where role_id=(select id from role where title="param1");`,
    validatedepartment: `select * from department join role ON role.department_id=department.id and department.name<>"Human Resources"`,
    deletedepartment: `delete from department`,
    deleteemployee: `delete from employee`,
    getemployeeid: 'SELECT id, first_name, last_name from employee where ',
    getemployeemanager: `select * from employee where manager_id=`,
    updateemployeemanager: `update employee set manager_id=null where manager_id=`,
    geteemployee: `select * from (select employee.*, concat_ws(" ", first_name, last_name) as fullname, role.title from employee join role on role.id=employee.role_id) as data `,
    totalrecords: `select "Roles" as Tablename, count(id) as Total from role UNION select "Departments" as Tablename, count(id) from department UNION select "Employees" as Tablename, count(id) from employee;`,
    getemployeesmanager:`select * from (select CONCAT_WS( " ", e.first_name, e.last_name ) as Fullname, CASE WHEN manager_id IS NULL THEN "No Manager" ELSE (select CONCAT_WS( " ", first_name, last_name) from employee where id=e.manager_id) END AS Manager from employee as e) as Data`,
    getmanagers: `select CONCAT_WS( " ", first_name, last_name ) as Fullname from employee join role on role.id=employee.role_id where title like "%manager%";`
}

const messages = {
    mysqlLapps: chalk.bgRed("Carleton Universty Coding Bootcamp"),
    departmentused: chalk.bgRed("Department has already been assigned to roles! Roles will be re-assigned to TBA department."),
    roleused: chalk.bgRed("Role is already been assigned to Employees! In case you delete Role, Empoyees would be assigned TBA Role"),
    employeebymanagers: chalk.bgWhite("List of ALL Employees order by management"),
    employeesbydepartment: chalk.bgWhite("List of Employees by Department"),
    departmentsbudget: chalk.bgWhite("Departments budget"),
    viewallemployees: chalk.bgWhite("Information from Employees Table"),
    viewallemployeesnodata: chalk.bgRed("There was no data in Employees Table"),
    viewalldepartments: chalk.bgWhite("Information from Departments Table"),
    viewalldepartmentsnodata: chalk.bgRed("There was no data in Departments Table"),
    viewallroles: chalk.bgWhite("Information from Roles Table"),
    viewallrolesnodata: chalk.bgRed("There was no data in Roles Table"),
    employeedeleted: chalk.bgRed("Employee has been deleted!"),
    addingdepartment: chalk.bgWhite("Adding a new department to database - enter Cancel to cancel action"),
    addingroles:chalk.bgWhite("Adding a new Role to database - enter Cancel to cancel action"),
    addingemployee:chalk.bgWhite("Adding a new Employee to database - enter Cancel to cancel action"),
    requestcanceled:chalk.bgRed("Your request has been cancelled! No changes done."),
    employeerole:chalk.bgYellow(`Employee selected `),
    createdbfirst: chalk.bgRed("Unable to use the MySQL CMS Employee Database without a database. Initialize the database and try again..."),
    createdbfirst: chalk.bgRed("Unable to use the MySQL CMS Employee application without a database. Initialize the database and try again..."),
    createdbhelp: chalk.bgRed("You can try using MySQL Shell command. Login into your MySQL instance: mysql -u root -p and then try source db/schemadata.sql"),
    pressctrlc: chalk.bgRed("Press Ctrl-C to terminate!"),
    totalrecords:chalk.bgWhite(`CRM MySQL Employee Database`),
}
module.exports = { sql, messages };