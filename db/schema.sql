-- Create tables on first run.
USE employees_db;

CREATE TABLE IF NOT EXISTS department (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  name VARCHAR(30) NOT NULL);

CREATE TABLE IF NOT EXISTS  role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  title DECIMAL NOT NULL,
  department_id INT
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE IF NOT EXISTS  employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);