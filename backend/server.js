require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variable debug logs
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// MySQL database connection
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

// === USER AUTHENTICATION ===
app.post('/api/users/search', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  db.query(
    'SELECT * FROM user WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// === INSTRUCTOR FUNCTIONALITIES ===

// Fetch statistics for instructor
app.get('/api/instructor/:id/statistics', (req, res) => {
  const profId = parseInt(req.params.id);
  if (!profId) return res.status(400).json({ message: 'Missing professor ID' });

  const sql = `
    SELECT
      (SELECT AVG(TIMESTAMPDIFF(MONTH, assignment_date, completion_date)) FROM thesis WHERE keysup_id = ?) AS avg_time_supervisor,
      (SELECT AVG(TIMESTAMPDIFF(MONTH, assignment_date, completion_date)) FROM thesis WHERE sup2_id = ? OR sup3_id = ?) AS avg_time_member,
      (SELECT AVG(g.total_grade) FROM grades g JOIN thesis t ON t.thes_id = g.thes_id WHERE g.prof_id = ? AND t.keysup_id = ?) AS avg_grade_supervisor,
      (SELECT AVG(g.total_grade) FROM grades g JOIN thesis t ON t.thes_id = g.thes_id WHERE g.prof_id = ? AND (t.sup2_id = ? OR t.sup3_id = ?)) AS avg_grade_member,
      (SELECT COUNT(*) FROM thesis WHERE keysup_id = ?) AS total_supervised,
      (SELECT COUNT(*) FROM thesis WHERE sup2_id = ? OR sup3_id = ?) AS total_member
  `;

  const values = [profId, profId, profId, profId, profId, profId, profId, profId, profId, profId, profId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('❌ Error fetching statistics:', err);
      return res.status(500).json({ message: 'Failed to fetch statistics' });
    }
    res.json(results[0]);
  });
});

// Get theses related to instructor
app.get('/api/instructor/theses', (req, res) => {
  const prof_id = parseInt(req.query.prof_id);
  if (!prof_id)
    return res.status(400).json({ message: 'Missing professor ID' });

  const sql = `
    SELECT t.thes_id, t.stud_id, t.status, t.id, t.keysup_id, t.assignment_date,
           pt.Prof2_id, pt.Prof2Response, pt.Prof3_id, pt.Prof3Response
    FROM thesis t
    LEFT JOIN pending_thes pt ON pt.thes_id = t.thes_id
    WHERE t.keysup_id = ? OR t.sup2_id = ? OR t.sup3_id = ?
  `;

  db.query(sql, [prof_id, prof_id, prof_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error loading theses' });
    res.json(results);
  });
});

// View committee invitations
app.get('/api/instructor/theses/:id/invitations', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT Prof2_id, Prof3_id, Prof2Response, Prof3Response
    FROM pending_thes
    WHERE thes_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error loading invitations' });
    res.json(results[0] || {});
  });
});

// Cancel a thesis assignment
app.post('/api/instructor/theses/:id/cancel', (req, res) => {
  const { id } = req.params;

  const deletePending = 'DELETE FROM pending_thes WHERE thes_id = ?';
  const deleteSupervised = 'DELETE FROM supervised WHERE thesis_id = ?';
  const deleteThesis = 'DELETE FROM thesis WHERE thes_id = ?';

  db.query(deletePending, [id], err => {
    if (err) return res.status(500).json({ message: 'Error deleting pending' });

    db.query(deleteSupervised, [id], err => {
      if (err) return res.status(500).json({ message: 'Error deleting supervision links' });

      db.query(deleteThesis, [id], err => {
        if (err) return res.status(500).json({ message: 'Error deleting thesis' });
        res.json({ message: 'Thesis assignment canceled' });
      });
    });
  });
});
app.get('/api/instructor/theses/:id/notes', (req, res) => {
  const { id } = req.params;
  const { prof_id } = req.query;

  db.query(
    'SELECT note, created_at FROM thesis_notes WHERE thes_id = ? AND prof_id = ?',
    [id, prof_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error loading notes' });
      res.json(results);
    }
  );
});
app.post('/api/instructor/theses/:id/cancel-after-two-years', (req, res) => {
  const { id } = req.params;
  const { assembly_number, assembly_year } = req.body;

  const checkDateSql = 'SELECT assignment_date FROM thesis WHERE thes_id = ?';
  db.query(checkDateSql, [id], (err, rows) => {
    if (err || rows.length === 0) return res.status(500).json({ message: 'Thesis not found' });

    const assignedDate = new Date(rows[0].assignment_date);
    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    if (assignedDate > twoYearsAgo)
      return res.status(400).json({ message: 'Cannot cancel before 2 years' });

    const sql = `
      UPDATE thesis
      SET status = 'cancelled',
          cancel_reason = 'by Instructor',
          assembly_number = ?,
          assembly_year = ?
      WHERE thes_id = ?
    `;
    db.query(sql, [assembly_number, assembly_year, id], err => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ message: 'Thesis cancelled after 2 years' });
    });
  });
});



// Add a note to a thesis
app.post('/api/instructor/theses/:id/notes', (req, res) => {
  const { id } = req.params;
  const { profId, noteText } = req.body;

  if (!profId || !noteText)
    return res.status(400).json({ message: 'Missing data' });

  db.query(
    'INSERT INTO thesis_notes (thes_id, prof_id, note) VALUES (?, ?, ?)',
    [id, profId, noteText],
    err => {
      if (err) return res.status(500).json({ message: 'Failed to save note' });
      res.json({ message: 'Note saved successfully' });
    }
  );
});

// Mark a thesis as under examination
app.post('/api/instructor/theses/:id/mark-exam', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE thesis SET status = "examining" WHERE thes_id = ?', [id], err => {
    if (err) return res.status(500).json({ message: 'Error updating status' });
    res.json({ message: 'Thesis marked as examining' });
  });
});

// View thesis announcement (placeholder)
app.get('/api/instructor/theses/:id/announcement', (req, res) => {
  res.json({ text: 'Presentation scheduled for [date/time]' });
});
app.get('/api/instructor/theses/:id/grades', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT prof_id, criteria1, criteria2, total_grade FROM grades WHERE thes_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error loading grades' });
      res.json(results);
    }
  );
});


// Submit a grade for a thesis
app.post('/api/instructor/theses/:id/grade', (req, res) => {
  const { id } = req.params;
  const { profId, criteria1 = 0, criteria2 = 0, total_grade } = req.body;

  const sql = `
    INSERT INTO grades (thes_id, prof_id, criteria1, criteria2, total_grade)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      criteria1 = VALUES(criteria1),
      criteria2 = VALUES(criteria2),
      total_grade = VALUES(total_grade)
  `;

  db.query(sql, [id, profId, criteria1, criteria2, total_grade], err => {
    if (err) return res.status(500).json({ message: 'Failed to record grade' });
    res.json({ message: 'Grade saved' });
  });
});
app.get('/api/stats', (req, res) => {
  const profId = parseInt(req.query.prof_id);
  if (!profId) return res.status(400).json({ message: 'Missing professor ID' });

  const sql = `
    SELECT
      -- Average completion time in months
      (SELECT AVG(TIMESTAMPDIFF(MONTH, assignment_date, completion_date)) 
         FROM thesis WHERE keysup_id = ?) AS supervisor_avg_completion,
      (SELECT AVG(TIMESTAMPDIFF(MONTH, assignment_date, completion_date)) 
         FROM thesis WHERE sup2_id = ? OR sup3_id = ?) AS committee_avg_completion,

      -- Average grades
      (SELECT AVG(g.total_grade) 
         FROM grades g JOIN thesis t ON g.thes_id = t.thes_id 
         WHERE g.prof_id = ? AND t.keysup_id = ?) AS supervisor_avg_grade,
      (SELECT AVG(g.total_grade) 
         FROM grades g JOIN thesis t ON g.thes_id = t.thes_id 
         WHERE g.prof_id = ? AND (t.sup2_id = ? OR t.sup3_id = ?)) AS committee_avg_grade,

      -- Total theses
      (SELECT COUNT(*) FROM thesis WHERE keysup_id = ?) AS supervisor_total,
      (SELECT COUNT(*) FROM thesis WHERE sup2_id = ? OR sup3_id = ?) AS committee_total
  `;

  const values = Array(11).fill(profId);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('❌ Stats error:', err);
      return res.status(500).json({ message: 'Stats query failed' });
    }

    const row = results[0];
    res.json({
      supervisor: {
        avg_completion: row.supervisor_avg_completion,
        avg_grade: row.supervisor_avg_grade,
        total: row.supervisor_total
      },
      committee: {
        avg_completion: row.committee_avg_completion,
        avg_grade: row.committee_avg_grade,
        total: row.committee_total
      }
    });
  });
});


// === TOPIC MANAGEMENT ===

// Get topics created by an instructor
app.get('/api/instructor/topics', (req, res) => {
  const profId = req.query.prof_id;
  console.log('🔍 GET /topics - prof_id:', profId);
  db.query(
    'SELECT id, title, description FROM topics WHERE prof_id = ?',
    [profId],
    (err, results) => {
      if (err) {
        console.error('❌ DB error in /topics:', err);
      return res.status(500).json({ message: 'Database error' });}
      res.json(results);
    }
  );
});

// Update a specific topic
app.put('/api/instructor/topics/:id', (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE topics SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    err => {
      if (err) return res.status(500).json({ message: 'Failed to update topic' });
      res.json({ message: 'Topic updated successfully' });
    }
  );
});

// Create a new topic
app.post('/api/instructor/topics', (req, res) => {
  const { title, description, prof_id } = req.body;
  if (!title || !description || !prof_id)
    return res.status(400).json({ message: 'Missing fields' });

  db.query(
    'INSERT INTO topics (title, description, prof_id) VALUES (?, ?, ?)',
    [title, description, prof_id],
    err => {
      if (err) return res.status(500).json({ message: 'Failed to create topic' });
      res.json({ message: 'Topic created' });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
