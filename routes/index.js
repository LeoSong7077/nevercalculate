const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// modules
const doAsync = require('../modules/function/doAsync');

router.get('/', (async function (request, response) {
    response.render(`index.ejs`);
}));

module.exports = router; 