// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

// Import required packages
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log environment variables
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
});

// ========== ROUTES ==========

// Simple login route (based on username/password)
app.post('/api/users/search', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  db.query(
    'SELECT * FROM user WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// Get thesis details for a student
app.post('/api/users/thesis', (req, res) => {
  const { stud_id } = req.body;

  if (!stud_id) {
    return res.status(400).json({ error: 'Missing student ID' });
  }

  db.query(
    'SELECT topic, status, keysup_id, sup2_id, sup3_id FROM thesis WHERE stud_id = ?',
    [stud_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// Instructor: get list of theses they supervise
app.get('/api/instructor/theses', (req, res) => {
  const instructor_id = parseInt(req.query.prof_id);
   // Replace with dynamic value in real app
  if (!instructor_id) {
    return res.status(400).json({ message: 'Missing professor ID' });
  }
  const sql = `
    SELECT t.thes_id, t.stud_id, t.status, t.topic
    FROM thesis t
    WHERE t.keysup_id = ? OR t.sup2_id = ? OR t.sup3_id = ?
  `;

  db.query(sql, [instructor_id, instructor_id, instructor_id], (err, results) => {
    if (err) {
      console.error('❌ DB Error in /theses:', err);
      return res.status(500).json({ message: 'Error loading theses' });
    }

    res.json(results);
  });
});

// Instructor: mark thesis as under examination
app.post('/api/instructor/theses/:id/mark-exam', (req, res) => {
  const thesisId = req.params.id;

  const sql = `UPDATE thesis SET status = 'examining' WHERE thes_id = ?`;

  db.query(sql, [thesisId], (err, result) => {
    if (err) {
      console.error('❌ Error updating thesis status:', err);
      return res.status(500).json({ message: 'Failed to update status' });
    }

    res.json({ message: 'Thesis marked as under examination' });
  });
});

// Instructor: create a new thesis topic (PDF upload can be added later)
app.get('/api/instructor/theses', (req, res) => {
  const instructor_id = parseInt(req.query.prof_id);
  if (!instructor_id) return res.status(400).json({ message: 'Missing professor ID' });

  const sql = `
    SELECT t.thes_id, t.stud_id, t.status, t.topic
    FROM thesis t
    WHERE t.keysup_id = ? OR t.sup2_id = ? OR t.sup3_id = ?
  `;

  db.query(sql, [instructor_id, instructor_id, instructor_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error loading theses' });
    }
    res.json(results);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
