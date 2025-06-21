// professor.js (complete with DOMContentLoaded and additional functionalities, with English comments)

document.addEventListener('DOMContentLoaded', () => {
  // Utility: Hide all panels
  const hideAllPanels = () => {
    document.querySelectorAll('.modal-overlay, .content-panel').forEach(el => {
      el.style.display = 'none';
    });
  };

  // Show a specific panel
  const showPanel = id => {
    hideAllPanels();
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  };

  // Button listeners to show panels
  document.querySelector('.cre.th')?.addEventListener('click', () => showPanel('createTopicForm'));
  document.querySelector('.ini.ass')?.addEventListener('click', () => showPanel('assignTopicForm'));
  document.querySelector('.vie.Lis')?.addEventListener('click', () => showPanel('listThesesPanel'));
  document.querySelector('.vie.Inv')?.addEventListener('click', () => showPanel('invitationPanel'));
  document.querySelector('.vie.sta')?.addEventListener('click', () => showPanel('statisticsPanel'));

  // Universal close buttons
  [
    'closeModal', 'cancelModal', 'closeAssignModal', 'cancelAssignModal',
    'closeManageModal', 'closeViewTopics', 'closeListPanel', 'closeInvitations', 'closeStatistics'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', hideAllPanels);
  });

  // CREATE TOPIC
  document.getElementById('topicForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const prof_id = localStorage.getItem('prof_id');

    try {
      const res = await fetch('http://localhost:3000/api/instructor/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, prof_id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create topic');
      alert(data.message || 'Topic created');
      hideAllPanels();
    } catch (err) {
      console.error('Create topic error:', err);
      alert('Error creating topic');
    }
  });

  // VIEW CREATED TOPICS
  document.querySelector('.vie.th')?.addEventListener('click', async () => {
    hideAllPanels();
    const panel = document.getElementById('viewTopicsPanel');
    const list = document.getElementById('createdTopicsList');
    panel.style.display = 'flex';
    list.innerHTML = '';

    const profId = localStorage.getItem('prof_id');
    if (!profId) return alert('Instructor ID not found');

    try {
      const res = await fetch(`http://localhost:3000/api/instructor/topics?prof_id=${profId}`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Unexpected response');
      if (data.length === 0) return list.innerHTML = '<li>No topics found.</li>';

      data.forEach(topic => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${topic.title}</strong><br/>
          <em>${topic.description}</em><br/>
          <button onclick="editTopic(${topic.id}, '${topic.title}', \`${topic.description}\`)">Edit</button>
          <hr/>
        `;
        list.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading topics:', err);
      list.innerHTML = '<li>Error loading topics</li>';
    }
  });

  // VIEW STATISTICS
  document.querySelector('.vie.sta')?.addEventListener('click', () => {
    document.getElementById('statisticsPanel').style.display = 'block';

    const profId = localStorage.getItem('prof_id');

    fetch(`http://localhost:3000/api/stats?prof_id=${profId}`)
      .then(res => res.json())
      .then(data => {
        renderChart('avgCompletionChart', 'Avg Completion Time', ['Supervisor', 'Committee'], [data.supervisor.avg_completion, data.committee.avg_completion]);
        renderChart('avgGradeChart', 'Avg Grade', ['Supervisor', 'Committee'], [data.supervisor.avg_grade, data.committee.avg_grade]);
        renderChart('totalThesesChart', 'Total Theses', ['Supervisor', 'Committee'], [data.supervisor.total, data.committee.total]);
      });
  });

  document.getElementById('closeStatistics')?.addEventListener('click', () => {
    document.getElementById('statisticsPanel').style.display = 'none';
  });

  function renderChart(canvasId, label, labels, data) {
  const canvas = document.getElementById(canvasId);
  canvas?.remove(); // remove old chart
  const newCanvas = document.createElement('canvas');
  newCanvas.id = canvasId;
  document.getElementById('statisticsPanel').appendChild(newCanvas);

  new Chart(newCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: ['#4CAF50', '#2196F3']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

  // MANAGEMENT OF THESES
  document.querySelector('.man.the')?.addEventListener('click', async () => {
    showPanel('thesisManagement');
    const list = document.getElementById('thesisList');
    list.innerHTML = '';
    document.getElementById('invitationDetails').style.display = 'none';

    try {
      const prof_id = localStorage.getItem('prof_id');
      const res = await fetch(`http://localhost:3000/api/instructor/theses?prof_id=${prof_id}`);
      const data = await res.json();

      data.forEach(thesis => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${thesis.topic}</strong> (Student: ${thesis.stud_id}) - ${thesis.status}<br/>`;

        if (thesis.status === 'assigning') {
          li.innerHTML += `
            <button onclick="viewInvitations(${thesis.thes_id})">View Invitations</button>
            <button onclick="cancelThesis(${thesis.thes_id})">Cancel Assignment</button>
          `;
        }

        if (thesis.status === 'active') {
          li.innerHTML += `
            <textarea id="note-${thesis.thes_id}" placeholder="Add note (max 300 chars)"></textarea>
            <button onclick="addNote(${thesis.thes_id})">Save Note</button>
            <button onclick="markAsExamining(${thesis.thes_id})">Mark as Under Examination</button>
          `;
        }

        if (thesis.status === 'examining') {
          li.innerHTML += `
            <a href="/uploads/${thesis.thes_id}/draft.pdf" target="_blank">View Draft</a><br>
            <button onclick="showAnnouncement(${thesis.thes_id})">View Announcement</button>
            <input type="number" id="grade-${thesis.thes_id}" min="0" max="10" placeholder="Your grade">
            <button onclick="submitGrade(${thesis.thes_id})">Submit Grade</button>
          `;
        }

        list.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading theses:', err);
      list.innerHTML = '<li>Error loading theses</li>';
    }
  });
});

// GLOBAL FUNCTIONS

window.editTopic = function(id, title, description) {
  const newTitle = prompt('New title:', title);
  const newDesc = prompt('New description:', description);
  if (!newTitle || !newDesc) return;

  fetch(`http://localhost:3000/api/instructor/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle, description: newDesc })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Topic updated.');
      document.querySelector('.vie.th').click(); // reload topics
    });
};

window.viewInvitations = async function(thesisId) {
  const res = await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/invitations`);
  const data = await res.json();

  const details = document.getElementById('invitationDetails');
  const list = document.getElementById('invitationList');
  list.innerHTML = '';
  details.style.display = 'block';

  data.forEach(i => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${i.prof_name} - ${i.response || 'Waiting'}<br>
      Invited: ${i.invited_date || 'N/A'} | Responded: ${i.response_date || 'N/A'}
    `;
    list.appendChild(li);
  });
};

window.cancelThesis = async function(thesisId) {
  if (confirm('Are you sure you want to cancel this assignment?')) {
    await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/cancel`, { method: 'POST' });
    alert('Assignment cancelled.');
    document.querySelector('.man.the').click();
  }
};

window.addNote = async function(thesisId) {
  const note = document.getElementById(`note-${thesisId}`).value;
  const prof_id = localStorage.getItem('prof_id');

  if (note.length > 300) return alert('Note too long.');
  await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ noteText: note, profId: prof_id })
  });
  alert('Note saved.');
};

window.markAsExamining = async function(thesisId) {
  await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/mark-exam`, { method: 'POST' });
  alert('Thesis marked as Under Examination.');
  document.querySelector('.man.the').click();
};

window.showAnnouncement = async function(thesisId) {
  const res = await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/announcement`);
  const data = await res.json();
  alert(data.text || 'No announcement available.');
};

window.submitGrade = async function(thesisId) {
  const grade = document.getElementById(`grade-${thesisId}`).value;
  const prof_id = localStorage.getItem('prof_id');
  await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade, profId: prof_id })
  });
  alert('Grade submitted.');
};
