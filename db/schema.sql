DROP DATABASE IF EXISTS employee_crm;
CREATE DATABASE employee_crm;

DROP TABLE IF EXISTS employee_crm.department;
CREATE TABLE employee_crm.department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB AUTO_INCREMENT=23 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

DROP TABLE IF EXISTS employee_crm.role;
CREATE TABLE employee_crm.role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(120) NOT NULL,
    salary DECIMAL(10 , 0 ) DEFAULT '1',
    department_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY department_id (department_id),
    CONSTRAINT role_ibfk_1 FOREIGN KEY (department_id) REFERENCES department (id)
)  ENGINE=INNODB AUTO_INCREMENT=78 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

DROP TABLE IF EXISTS employee_crm.employee;
CREATE TABLE employee_crm.employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT DEFAULT NULL,
    manager_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY manager_id (manager_id), CONSTRAINT employee_ibfk_1 FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE SET NULL,
    KEY role_id (role_id), CONSTRAINT role_idemployeefk FOREIGN KEY (role_id) REFERENCES role (id)
)  ENGINE=INNODB AUTO_INCREMENT=56 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;