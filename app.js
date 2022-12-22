const loaders = require('./loaders');
const express = require('express');
// const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : true, limit: '5mb'}));
// app.use(cors());

loaders(app);