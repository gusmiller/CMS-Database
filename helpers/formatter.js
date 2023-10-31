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

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});

function money(value){
    return formatter.format(value);
};

function resize(value, size) {
    if (value.length >= size) {
        return value.slice(0, size); // No need to pad, already long enough
    } else {
        return value + ' '.repeat(size - value.length);
    }
}

function nodata(value){
    console.log("");
    console.log(chalk.bgRed(value));
    console.log("");
}

function carletonlogo(){
    
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
module.exports = {money, resize, nodata, carletonlogo};