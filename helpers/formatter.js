/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment #12 - SQL Content Management Systems (CMS)
 * Date : 10/31/2023 6:01:53 AM
 * 
 * Description :
 * This file is used to execute helper functions available to the 
 * formatting of the terminal
 *******************************************************************/
const chalk = require('chalk');

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', });

const parseSqlFile = (sqlFile) => {
    return sqlFile
        .toString()
        .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
        .replace(/\s+/g, ' ') // excess white space
        .split(";") // split into all statements
}

function messagelogger(value, add, blankline, sizestring) {
    if (value === undefined) {
        console.log("");
        return;
    }

    if (sizestring === undefined || value.length > sizestring) { sizestring = 140 };

    // Validate for chalk colors
    if (value.lastIndexOf("39m") || value.lastIndexOf("49m")) {
        let firstthree = value.substring(0, 5); // Retrieve the first 3 characters
        let lastfive = value.substring(value.length - 5); // Get the last portion

        let newvalue = value.substring(5); // Remove chalk characters
        newvalue = newvalue.slice(0, -5);

        // validate additional information to be added into the message. This will basically
        // inject the tail message to inherit the color
        if (add !== undefined && add !== null) {
            newvalue += add;
        }

        const padding = " ".repeat(sizestring - newvalue.length); // Build the fixed length string
        console.log(firstthree + newvalue + padding + lastfive); // Put message all back togeher 
    } else {
        console.log(value);
    }

    if (blankline === undefined || blankline === null) { console.log(""); }

    return;
}

function money(value) {
    return formatter.format(value);
};

function resize(value, size) {
    if (value.length >= size) {
        return value.slice(0, size); // No need to pad, already long enough
    } else {
        return value + ' '.repeat(size - value.length);
    }
}

function nodata(value) {
    console.log("");
    console.log(chalk.bgRed(value));
    console.log("");
}

function carletonlogo() {

    process.stdout.write("\x1Bc");
    console.log(chalk.white("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
    console.log("");
    console.log(chalk.red("                    _____           _     _____"));
    console.log(chalk.red("                    | ___| __ _ _ __| | __|_  __|__ _ __"));
    console.log(chalk.red("                    | |   / _  | '__| |/ _ \\| |/ _ \\ '_  \\"));
    console.log(chalk.red("                    | |__  (_| | |  | |  __/| | (_)| | | |"))
    console.log(chalk.red("                    |____|\\__,_|_|  |_|\\___||_|\\___/_| |_|"))
    console.log(chalk.red("                                  _   _"))
    console.log(chalk.red("                                 | | | |"))
    console.log(chalk.red("                                 | | | |"))
    console.log(chalk.red("                                 | | | |"))
    console.log(chalk.red("                                 |_____|"))
    console.log("");
    console.log(chalk.white("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"));
    console.log("");

}
module.exports = { money, resize, nodata, carletonlogo, messagelogger, parseSqlFile };