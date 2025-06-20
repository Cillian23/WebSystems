document.addEventListener('DOMContentLoaded', () => {

const hideAllPanels = () => {
  document.querySelectorAll('.modal-overlay, .content-panel').forEach(el => {
    el.style.display = 'none';
  });
};

const showPanel = id => {
  hideAllPanels(); // Oculta todo antes de mostrar otro
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex'; // O block, dependiendo del contenedor
};

  // Panel buttons
  document.querySelector('.cre.th').addEventListener('click', () => showPanel('createTopicForm'));
  document.querySelector('.ini.ass').addEventListener('click', () => showPanel('assignTopicForm'));
  document.querySelector('.vie.th').addEventListener('click', () => showPanel('viewTopicsPanel'));
  document.querySelector('.vie.Lis').addEventListener('click', () => showPanel('listThesesPanel'));
  document.querySelector('.vie.Inv').addEventListener('click', () => showPanel('invitationPanel'));
  document.querySelector('.vie.sta').addEventListener('click', () => showPanel('statisticsPanel'));

  // Management of Theses - fetch from backend
  document.querySelector('.man.the').addEventListener('click', async () => {
    showPanel('thesisManagement');
    const list = document.getElementById('thesisList');
    list.innerHTML = '';

    try {
      const profId = localStorage.getItem('prof_id');
      if (!profId) {
        alert('No instructor ID found. Please log in again.');
        return;
      }

      const res = await fetch(`http://localhost:3000/api/instructor/theses?prof_id=${profId}`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Unexpected data');

      data.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.topic} (Student: ${t.stud_id}) - ${t.status}`;
        list.appendChild(li);
      });
    } catch (err) {
      list.innerHTML = '<li>Error loading theses</li>';
      console.error('Error:', err);
    }
  });

  // Close buttons
  ['closeModal','cancelModal','closeAssignModal','cancelAssignModal',
   'closeManageModal','closeViewTopics','closeListPanel','closeInvitations','closeStatistics']
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', hideAllPanels);
  });

  // Create Topic form submission
  document.getElementById('topicForm').addEventListener('submit', async e => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const res = await fetch('http://localhost:3000/api/instructor/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json();
    alert(data.message || 'Topic created');
    hideAllPanels();
  });
});
