/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/31/2023 9:57:40 AM
 *
 * MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
 * Database: employees_db
 * Server version	8.0.34
 *******************************************************************/
DROP TABLE IF EXISTS department;
CREATE TABLEdepartment ( id int NOT NULL AUTO_INCREMENT, name varchar(30) NOT NULL, PRIMARY KEY (id)
  ) ENGINE = InnoDB AUTO_INCREMENT = 23 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES department WRITE;

INSERT INTO department
VALUES
	(1, 'Upper management'),
	(2, 'Administration and management'),
	(3, 'Human Resources'),
	(4, 'Procurement'),
	(5, 'Infrastructure'),
	(6, 'Architecture'),
	(7, 'Operations'),
	(8, 'Engineering'),
	(9, 'QA'),
	(10, 'Security'),
	(11, 'Customer Service'),
	(12, 'Legal'),
	(13, 'Finance'),
	(14, 'Accounting'),
	(15, 'Treasury'),
	(16, 'Marketing'),
	(17, 'Merchandising'),
	(18, 'Commercial'),
	(19, 'Purchasing'),
	(20, 'Logistics'),
	(21, 'Production'),
	(22, 'TBA');

UNLOCK TABLES;

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (id int NOT NULL AUTO_INCREMENT, first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL, role_id int DEFAULT NULL, manager_id int DEFAULT NULL, PRIMARY KEY (id), KEY manager_id (manager_id), CONSTRAINT employee_ibfk_1 FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE
SET NULL) ENGINE = InnoDB AUTO_INCREMENT = 56 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES employee WRITE;

INSERT INTO  employee
VALUES
	(1, 'Gustavo', 'Miller', 7, NULL),
	(3, 'Felipe', 'Farrell', 20, 47),
	(4, 'Mirtha', 'Isabelle', 43, 5),
	(5, 'Camelia', 'Blackburn', 15, NULL),
	(6, 'Jim', 'Yates', 54, 1),
	(7, 'Andre', 'Haley', 2, 47),
	(8, 'Andrew', 'Lewis', 17, 47),
	(9, 'Anne', 'Salazar', 2, 47),
	(11, 'Elva', 'Galindo', 24, 55),
	(12, 'Benton', 'Lee', 8, NULL),
	(13, 'Randy', 'Lucero', 17, NULL),
	(14, 'Brian', 'Delgado', 64, 55),
	(15, 'Bejamin', 'Atkinson', 25, NULL),
	(16, 'Tom', 'Middleton', 65, NULL),
	(17, 'Cheryl', 'Koch', 17, 5),
	(18, 'Lori-Ann', 'Lara', 31, NULL),
	(19, 'Corey', 'Schneider', 57, 5),
	(20, 'Winnifred', 'Woodard', 64, NULL),
	(21, 'Dale', 'Peters', 46, NULL),
	(22, 'David', 'Bejamin', 47, NULL),
	(23, 'David', 'Richmond', 37, 22),
	(24, 'Diane', 'Gregory', 17, 22),
	(25, 'Dave', 'Hayden', 53, 22),
	(26, 'Donna', 'Thompson', 14, 22),
	(27, 'Ernie', 'Meadows', 4, 55),
	(28, 'Erik', 'Bowen', 62, NULL),
	(29, 'Esther', 'Norton', 60, 55),
	(30, 'Fred', 'Salas', 21, NULL),
	(31, 'Geoff', 'Waters', 44, 55),
	(32, 'Gretha', 'McKee', 37, 55),
	(33, 'Glenn', 'Sellers', 16, 55),
	(36, 'Hilary', 'Brady', 58, 22),
	(37, 'Joshua', 'Xiomara ', 14, 47),
	(38, 'Hannah', 'Walters', 9, 22),
	(39, 'Heidi', 'Jamir ', 47, NULL),
	(40, 'Randy', 'Mara ', 59, NULL),
	(41, 'Isabelle', 'Jagger ', 35, 5),
	(42, 'Isaiah', 'Colten ', 51, 5),
	(43, 'Jessica', 'Burgess', 37, 47),
	(44, 'John', 'Maxwell ', 27, 47),
	(45, 'Jim', 'Daniela', 1, 1),
	(46, 'Jim', 'Delaney ', 50, 1),
	(47, 'James', 'Tanner', 10, NULL),
	(48, 'Jody', 'Ponce', 31, 1),
	(49, 'John', 'Kennedy', 60, 47),
	(50, 'John', 'Payne', 40, 47),
	(51, 'John', 'Xiomara ', 23, NULL),
	(52, 'Jonathan', 'Blankenship', 38, NULL),
	(53, 'Julie', 'Kennedy', 36, 47),
	(54, 'Julie', 'Langston ', 29, 47),
	(55, 'Julie', 'Jennings', 52, NULL);

UNLOCK TABLES;

DROP TABLE IF EXISTS role;
CREATE TABLE role (id int NOT NULL AUTO_INCREMENT, title varchar(120) NOT NULL, salary decimal(10, 0) DEFAULT '1', department_id int DEFAULT NULL, PRIMARY KEY (id), KEY department_id (department_id),
CONSTRAINT role_ibfk_1 FOREIGN KEY (department_id) REFERENCES department (id)) ENGINE = InnoDB AUTO_INCREMENT = 78 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES role WRITE;

INSERT INTO role
VALUES
  (1, 'Chief Information Officer (CIO)', 63439, 1),
  (2, 'IT Director', 42374, 1),
  (3, 'Chief Technology Officer (CTO)', 111556, 1),
  (4, 'Chief Information Security Officer (CISO)', 145658, 1),
  (5, 'IT manager', 108622, 2),
  (6, 'IT project manager', 71136, 2),
  (7, 'IT product manager', 119813, 2),
  (8, 'IT coordinator', 100660, 2),
  (9, 'Business analyst', 108859, 2),
  (10, 'Procurement manager', 82316, 4),
  (11, 'Procurement officer', 50005, 4),
  (12, 'Purchasing agent', 93079, 4),
  (13, 'Procurement analyst', 155379, 4),
  (14, 'Procurement specialist', 87656, 4),
  (15, 'Infrastructure manager', 62147, 5),
  (16, 'Infrastructure engineer', 137765, 5),
  (17, 'Database administrator (DBA)', 92386, 5),
  (18, 'Database engineer', 138634, 5),
  (19, 'Database architect', 131014, 5),
  (20, 'Database analyst', 79166, 5),
  (21, 'Database specialist', 92790, 5),
  (22, 'Network manager', 66454, 5),
  (23, 'Network engineer', 143897, 5),
  (24, 'Network administrator', 110127, 5),
  (25, 'Network architect', 83945, 5),
  (26, 'Network analyst', 54341, 5),
  (27, 'Network specialist', 109873, 5),
  (28, 'Chief enterprise architect', 101342, 6),
  (29, 'Enterprise architect', 142092, 6),
  (30, 'Systems architect', 121433, 6),
  (31, 'Systems engineer', 145892, 6),
  (32, 'Systems coordinator', 80160, 6),
  (33, 'Systems analyst', 53127, 6),
  (34, 'IT operations director', 115153, 7),
  (35, 'Sysadmin', 131385, 7),
  (36, 'Hardware technician', 151465, 7),
  (37, 'Support administrator', 78174, 7),
  (38, 'IT support specialist', 151472, 7),
  (39, 'Help desk technician', 112841, 7),
  (40, 'Desktop support specialist', 74788, 7),
  (41, 'Software development', 125416, 8),
  (42, 'Development manager', 117718, 8),
  (43, 'Full-stack developer', 52343, 8),
  (44, 'Back-end developer', 123560, 8),
  (45, 'Front-end developer', 50771, 8),
  (46, 'Software architect', 98176, 8),
  (47, 'IT QA manager', 53566, 9),
  (48, 'QA engineer', 63305, 9),
  (49, 'QA analyst', 120828, 9),
  (50, 'Software tester', 129226, 9),
  (51, 'Business applications', 123645, 9),
  (52, 'Business applications manager', 70546, 9),
  (53, 'Application developer', 71799, 9),
  (54, 'Application analyst', 112355, 9),
  (55, 'Information security manager', 61381, 10),
  (56, 'Information security engineer', 59838, 10),
  (57, 'Information security analyst', 80049, 10),
  (58, 'Cloud security architect', 60732, 10),
  (59, 'Application security administrator', 153515, 10),
  (60, 'Cybersecurity analyst', 50376, 10),
  (61, 'Cybersecurity specialist', 131338, 10),
  (62, 'Data security specialist', 95562, 10),
  (63, 'Business intelligence', 48795, 10),
  (65, 'IT Supervisor', 47289, 2),
  (66, 'TBA', 0, 3),
  (67, 'Legal', 1, NULL),
  (68, 'Finance', 1, NULL),
  (69, 'Accounting', 1, NULL),
  (70, 'Treasury', 1, NULL),
  (71, 'Marketing', 1, NULL),
  (72, 'Merchandising', 1, NULL),
  (73, 'Commercial', 1, NULL),
  (74, 'Purchasing', 1, NULL),
  (75, 'Logistics', 1, NULL),
  (76, 'Production', 1, NULL),
  (77, 'Legal', 1, NULL);

UNLOCK TABLES;