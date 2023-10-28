/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/26/2023 10:03:23 PM
 *******************************************************************/
const db = require('./connect');

class Data {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }

    static listALLTable(source) {
        
        let sql = `SELECT * FROM ${source};`;
        
        return db.execute(sql);

    }
}

module.exports = Data;