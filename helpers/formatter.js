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

module.exports = {money, resize, nodata};