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

const sqldictionary = {
    managers: 'select * from (select concat_ws(" ", first_name, last_name) as Manager from employee join role on employee.role_id=role.id where title like "%manager%") as data order by Manager;',
    departments: `SELECT name FROM department;`,
    roles: `SELECT title FROM role;`,
    allroles: `SELECT R.title, R.id, D.name, R.salary FROM role R JOIN department D ON D.id=R.department_id`,
    employees: `SELECT E.id, CONCAT_WS( " ", E.first_name, E.last_name ) as Fullname, r.title, d.name, r.salary, CASE WHEN ISNULL(M.first_name) THEN "No Manager" ELSE CONCAT_WS( " ", M.first_name, M.last_name ) END AS Manager FROM employee E JOIN role R ON R.id=E.role_id JOIN department D ON D.id=R.department_id LEFT JOIN employee M ON M.id=E.manager_id`,
    empbymanager:`select concat_ws(" ", first_name, last_name) as Fullname, data.* from (select e.*, role.title, (select concat_ws(" ", first_name, last_name) from employee where id=e.manager_id) as Manager from employee e join role on e.role_id=role.id where not e.manager_id is null) as data`,
    empbydepartment:`select d.id as DepartmentID, d.name, e.id, concat_ws(" ", first_name, last_name) as Fullname, r.title, r.salary from employee as e join role as r on r.id=e.role_id join department as d on d.id=r.department_id order by d.id, e.id`,
    departmentbudget:`select d.id, d.name, SUM(r.salary) as budget from employee as e join role as r on r.id=e.role_id join department as d on d.id=r.department_id group by d.id, d.name`,
}

module.exports = sqldictionary;