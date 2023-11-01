/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/31/2023 9:57:40 AM
 *******************************************************************/
CREATE SCHEMA IF NOT EXISTS employeedb DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE employeedb;

-- Drop and Create Departments table
DROP TABLE IF EXISTS department;

CREATE TABLE
  IF NOT EXISTS department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE = InnoDB AUTO_INCREMENT = 23 DEFAULT CHARACTER
SET
  = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Drop and Create Employees table
DROP TABLE IF EXISTS employee;

CREATE TABLE
  IF NOT EXISTS employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL DEFAULT NULL,
    manager_id INT NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX manager_id (manager_id ASC) VISIBLE,
    CONSTRAINT employee_ibfk_1 FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE
    SET
      NULL
  ) ENGINE = InnoDB AUTO_INCREMENT = 56 DEFAULT CHARACTER
SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Drop and Create Roles table
DROP TABLE IF EXISTS role;

CREATE TABLE
  IF NOT EXISTS role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(120) NOT NULL,
    salary DECIMAL(10, 0) NULL DEFAULT '1',
    department_id INT NULL DEFAULT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX department_id (department_id ASC) VISIBLE,
    INDEX fk_role_employee1_idx (employee_id ASC) VISIBLE,
    CONSTRAINT role_ibfk_1 FOREIGN KEY (department_id) REFERENCES department (id),
    CONSTRAINT fk_role_employee1 FOREIGN KEY (employee_id) REFERENCES employee (id) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB AUTO_INCREMENT = 78 DEFAULT CHARACTER
SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;