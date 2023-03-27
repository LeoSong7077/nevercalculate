const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// modules
const doAsync = require('../modules/function/doAsync');

router.get('/', (async function (request, response) {
    response.render(`index.ejs`);
}));

router.post('/calculate', (async function (request, response) {
    const { payments } = request.body;

    // validation
    let sum = 0;
    let isNegative = false, isTooLow = false;
    for (let i = 0; i < payments.length; i++) {
        const value = Number(payments[i].value);
        if (value < 0) isNegative = true;
        if (value < 100) isTooLow = true;
        sum += value;
    }
    if (isNegative) return response.send({success:false, failType:'negative'});
    if (sum === 0) return response.send({success:false, failType:'sum_0'});
    // if (isTooLow) return response.send({success:false, failType:'too_low'});

    const results = Array.from({length: payments.length}, () => []);
    const size = payments.length;
    
    for (let i = 0; i < size; i++) {
        const sd_payment = payments[i]; // standard payment
        for (let j = i + 1; j < size; j++) {
            const cp_payment = payments[j]; // compare payment
            const diff = Math.abs(round(sd_payment.value/size, 10) - round(cp_payment.value/size, 10));
            const sd_payment_value = Number(sd_payment.value);
            const cp_payment_value = Number(cp_payment.value);
            if (sd_payment_value > cp_payment_value)
                results[j].push({ name:sd_payment.name, value:diff }); // index:j
            else if (cp_payment_value - sd_payment_value > 0)
                results[i].push({ name:cp_payment.name, value:diff }); // index:i
        }
    }

    response.send({success:true, data:results})
}));

router.get('/auth/telegram',
    passport.authenticate('telegram'),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
});

router.get('/robots.txt', function (request, response) {
    response.type("text/plain");
    response.send('User-agent: *\nAllow: /');
});

router.get('/sitemap.xml', function (request, response) {
    let data = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://nevercalculate.com/</loc>
        <lastmod>2023-02-23T13:42:00+09:00</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
    </urlset>`;

    response.header("Content-Type", "application/xml");
    response.status(200).send(data);
});

module.exports = router; 

function round(value, digit) {
    return Math.round(value / digit) * digit;
}

// +/- calculator