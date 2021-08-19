var express = require('express');
var bodyparser = require('body-parser');
const mysql = require('mysql');


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


require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log('Example app listening on port${port}!'))


