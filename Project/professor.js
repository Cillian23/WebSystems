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
  function loadTheses() {
  const profId = localStorage.getItem("prof_id");
  if (!profId) return alert("Missing professor ID");

  fetch(`http://localhost:3000/api/instructor/theses?prof_id=${profId}`)
    .then(res => {
      if (!res.ok) throw new Error("Unexpected response");
      return res.json();
    })
    .then(data => {
      console.log("Fetched theses:", data); // 👈 Te mostrará si hay resultados
      const list = document.getElementById("thesisList");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>No theses found</li>";
        return;
      }

      data.forEach(thesis => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>Topic:</strong> ${thesis.topic}<br>
          <strong>Status:</strong> ${thesis.status}<br>
          <strong>Student:</strong> ${thesis.stud_id}
        `;
        if (list) {
          list.appendChild(item);
        } else {
          console.error("❌ thesisList not found in the DOM");
}

        list.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Error loading theses:", err);
      const list = document.getElementById("thesisList");
      list.innerHTML = "<li style='color:red;'>Error loading theses</li>";
    });
}

  document.querySelector('.man.the')?.addEventListener('click', async () => {
    showPanel('thesisManagement');
    const list =   document.getElementById("thesisManagement").style.display = "block";
    loadTheses();
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
        fetch(`http://localhost:3000/api/instructor/theses/${thesis.thes_id}/invitations`)    .then(response => {
      if (!response.ok) throw new Error('Failed to load invitations');
      return response.json();
    })
    .then(data => {
      const invitationList = document.createElement('ul');
      invitationList.innerHTML = `
        <li><strong>Prof2 ID:</strong> ${data.Prof2_id} — <em>${data.Prof2Response}</em></li>
        <li><strong>Prof3 ID:</strong> ${data.Prof3_id} — <em>${data.Prof3Response}</em></li>
      `;
      container.appendChild(invitationList);  // Añadir al contenedor de la tesis
    })
    .catch(err => {
      console.error('Error loading invitations:', err);
    });
}


  if (thesis.status === 'active' && thesis.keysup_id == prof_id) {
    const canCancel = (new Date(thesis.assignment_date) <= new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000));
    if (canCancel) {
      li.innerHTML += `
        <label>Assembly #: <input id="assemblyNum-${thesis.thes_id}" type="number"></label>
        <label>Year: <input id="assemblyYear-${thesis.thes_id}" type="number"></label>
        <button onclick="cancelAfter2Years(${thesis.thes_id})">Cancel Thesis (2+ yrs)</button>
    `;
  }
}
        if (thesis.status === 'examining') {
          li.innerHTML += `
            <a href="/uploads/${thesis.thes_id}/draft.pdf" target="_blank">View Draft</a><br>
            <button onclick="showAnnouncement(${thesis.thes_id})">View Announcement</button>
            <input type="number" id="grade-${thesis.thes_id}" min="0" max="10" placeholder="Your grade">
            <button onclick="submitGrade(${thesis.thes_id})">Submit Grade</button>
          `;
        }
        if (list) {
          list.appendChild(item);
        } else {
          console.error("❌ thesisList not found in the DOM");
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
