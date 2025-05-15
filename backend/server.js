require('dotenv').config({ path: __dirname + '/.env' });
/*This is so you can connect database from your computer, set up a file called .env (In same folder as this file) and put in following
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=yourdbname
All examples, use relevant ones
gitignore contains the .env file and also the node_modules from installing node.js and setting up the project, can just do it yourself
*/



const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

console.log('DB_USER:', process.env.DB_USER);




// Middleware
app.use(cors());
app.use(express.json());

// MySQL

const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.PORT
});


db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Example Route
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
