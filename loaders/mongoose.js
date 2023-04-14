const mongoose = require('mongoose');

module.exports = async function() {
    const connection = mongoose.connect(process.env.SERVER_DB_URL, {
        dbName: process.env.SERVER_DB_NAME,
        useNewUrlParser: true, 
        autoIndex : true,
        useUnifiedTopology: true,
    });

    console.log('MongoDB Intialized');

    

}

// console.log('\n10% 손해 결과분석\n');
// let firstLine = '';
// let secondLine = '';
// for (let i = 9; i >= 0; i--) {
//     firstLine = firstLine + (i + '회\t');
//     secondLine = secondLine + ((Math.pow(0.9, i) * Math.pow(1.05, (30 - i))).toFixed(4) + '\t');
// }
// console.log(firstLine + '\n' + secondLine);

// console.log('\n20% 손해 결과분석\n')
// firstLine = '';
// secondLine = '';
// for (let i = 5; i >= 0; i--) {
//     firstLine = firstLine + (i + '회\t');
//     secondLine = secondLine + ((Math.pow(0.8, i) * Math.pow(1.05, (30 - i))).toFixed(4) + '\t');
// }
// console.log(firstLine + '\n' + secondLine);
// console.log();


// function percentRiskAnalysis(percent, vacationCount) {
//     let firstLine = '', secondLine = '';
//     const total = 30 - vacationCount;
// }