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
console.log('DB_USER:', process.env.DB_NAME);

  var username1;    //initialise username for update on each user




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
app.post('/api/users/search', (req, res) => {     //Queries database for student details after username and password are used to log in
  const { username, password } = req.body;
  //username1=username;
  console.log(req.body);
  // Both parameters are required
  if (!username || !password) {
    console.log("shite");
    return res.status(400).json({ error: 'Username/Password are incorrect' });
  }
  
  db.query('SELECT * FROM user WHERE username = ? AND password = ?', 
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

app.post('/api/users/thesis', (req, res) => {    //Queries database for thesis details once student id is passed in, for access from student page, view thesis button
  const {stud_id} = req.body;
  console.log(stud_id);
  if (!stud_id) {
    console.log('fucked it');
    return res.status(400).json({ error: 'No student ID' });
  }

  db.query('SELECT topic, status, key_sup, sup2_id, sup3_id FROM thesis WHERE stud_id = ?', 
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

// IT WORKS!!!! Update saved details in database
app.post('/api/users/UpdateStudDeets', (req, res) => {    //Updates saved details in edit profile section, sends new details to database
  const {PostAddr, email, mobileNum, landlineNum} = req.body;
  console.log(PostAddr);
  var username = username1;

  db.query('UPDATE user SET PostAddr = ?, email = ?, mobileNum = ?, landlineNum = ? WHERE username = ?', 
    [PostAddr, email, mobileNum, landlineNum, username], 
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


//Don't think this is actually necessary, all data loaded in at start, only need to send back updated details
/*app.post('/api/users/search', (req, res) => {     //Queries database for profile details e.g. address and number after student clicks edit profile
  const { PostAddr, email, mobileNum, landlineNum } = req.body;
  
  db.query('SELECT  FROM student WHERE username = ? AND password = ?', 
    [username, password], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
}); */

app.listen(port, () => {                                 //Confirms connection to database
  console.log(`Server running on http://localhost:${port}`);
});


