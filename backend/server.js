require('dotenv').config({ path: __dirname + '/.env' });
/*This is so you can connect database from your computer, set up a file called .env (In same folder as this file) and put in following
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=yourdbname
All examples, use relevant ones
gitignore contains the .env file and also the node_modules from installing node.js and setting up the project, can just do it yourself
*/

//Set up --------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

console.log('DB_USER:', process.env.DB_USER);





// Middleware --------------------------------------------------------------------------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL, connect to database with credentials from .env file -----------------------------------------------------------------------------------------------------------

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

//Routes to the database ------------------------------------------------------------------------------------------------------------------------------------------
// Example Route
/*app.get('/api/users', (req, res) => {
  db.query(`SELECT * FROM student`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
    console.log(req);
  });
});*/
app.post('/api/users/search', (req, res) => {
  const { username, password } = req.body;
  
  // Both parameters are required
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Password are incorrect' });
  }
  
  db.query('SELECT * FROM student WHERE username = ? AND password = ?', 
    [username, password], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

app.post('/api/users/thesis', (req, res) => {
  const {stud_id} = req.body;
  console.log(stud_id);
  if (!stud_id) {
    console.log('fucked it');
    return res.status(400).json({ error: 'No student ID' });
  }

  db.query('SELECT * FROM thesis WHERE stud_id = ?', 
    [stud_id], 
    (err, results) => {
      if (err) {
        console.log('propa fucked');
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


