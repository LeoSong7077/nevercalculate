const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// modules
const doAsync = require('../modules/function/doAsync');

router.get('/', (async function (request, response) {
    response.render(`index.ejs`);
}));

router.post('/calculate', (async function (request, response) {
    const { payments } = request.body;
    
    const results = Array.from({length: payments.length}, () => []);
    const size = payments.length;
    
    for (let i = 0; i < size; i++) {
        const sd_payment = payments[i]; // standard payment
        for (let j = i; j < size; j++) {
            const cp_payment = payments[j]; // compare payment
            const diff = Math.abs(round(sd_payment.value/size, 10) - round(cp_payment.value/size, 10));
            if (sd_payment.value > cp_payment.value)
                results[j].push({ name:cp_payment.name, value:diff, index:j })
            else if (cp_payment.value - sd_payment.value > 0)
                results[i].push({ name:sd_payment.name, value:diff, index:i })
        }
    }

    // console.log(results);

    response.send({success:true, data:results})
}));

module.exports = router; 

function round(value, digit) {
    return Math.round(value / digit) * digit;
}