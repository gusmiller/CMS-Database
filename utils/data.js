/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 *******************************************************************/
const db = require("./connect");

async function getTable(value) {
  const connection = await db();

  try {

      const [rows, fields] = await connection.execute(`SELECT * FROM ${value}`);
      return {count: rows.length, rows};

  } catch (error) {
      console.error('Error retrieving data:', error);

  } finally {
      connection.end(); // Close the database connection when done
  }
}

module.exports = {getTable};