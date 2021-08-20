var express = require('express');
var bodyParser = require('body-parser');
var session = require ('express-session');
var validator = require ('express-validator');
var sanatizer = require('express-sanitizer');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 8000;

const db = mysql.createConnection ({
host: 'localhost',
user: 'root',
password: 'test',
database: 'GamerInsurance'
});

db.connect((err) =>{
if (err){
throw err;
}
console.log('DB Connection: Successful');
});
global.db = db;

app.set('views',__dirname + '/views');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json()); 

app.use(session({
	secret: 'somerandomstuffs',
	resave: false,
	saveUninitialized: false,
	cookie:{
	expires: 600000
	}
}));

require('./routes/main')(app);


app.listen(port, () => console.log('Example app listening on port${port}!'))
