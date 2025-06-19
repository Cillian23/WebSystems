document.addEventListener('DOMContentLoaded', () => {
   document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // CREATE TOPIC MODAL
    // =========================
    const openCreateBtn = document.querySelector('.cre.th');
    const createModal = document.getElementById('createTopicForm');
    const closeCreateBtn = document.getElementById('closeModal');
    const cancelCreateBtn = document.getElementById('cancelModal');
    const topicForm = document.getElementById('topicForm');

    openCreateBtn.addEventListener('click', () => {
        createModal.style.display = 'flex';
        topicForm.reset();
    });

    closeCreateBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    cancelCreateBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    topicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const file = document.getElementById('pdfFile').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) formData.append('pdf', file);

        try {
            const res = await fetch('/api/instructor/topics', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            alert(data.message || 'Topic created');
            createModal.style.display = 'none';
            topicForm.reset();
        } catch (err) {
            console.error('Error creating topic:', err);
            alert('Failed to submit topic');
        }
    });

    // =========================
    // VIEW TOPICS CREATED
    // =========================
    const viewTopicsButton = document.querySelector('.vie.th');
    const topicsListContainer = document.getElementById('topicsListContainer');
    const topicsList = document.getElementById('topicsList');

    if (viewTopicsButton && topicsListContainer && topicsList) {
        viewTopicsButton.addEventListener('click', async () => {
            topicsListContainer.style.display = 'block';
            topicsList.innerHTML = '<li>Loading...</li>';

            try {
                const res = await fetch('/api/instructor/topics');
                const data = await res.json();
                topicsList.innerHTML = '';

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(topic => {
                        const item = document.createElement('li');
                        item.style.marginBottom = '15px';
                        item.innerHTML = `
                            <strong>${topic.title}</strong><br/>
                            <em>${topic.description}</em>
                            ${topic.pdf_filename ? <br/><a href="/uploads/${topic.pdf_filename}" target="_blank">View PDF</a> : ''}
                        `;
                        topicsList.appendChild(item);
                    });
                } else {
                    topicsList.innerHTML = '<li>No topics found.</li>';
                }
            } catch (err) {
                console.error('Error loading topics:', err);
                topicsList.innerHTML = '<li>Error loading topics.</li>';
            }
        });
    }

    // =========================
    // ASSIGN TOPIC TO STUDENT
    // =========================
    const openAssignButton = document.querySelector('.ini.ass');
    const assignModal = document.getElementById('assignTopicForm');
    const closeAssignButton = document.getElementById('closeAssignModal');
    const cancelAssignButton = document.getElementById('cancelAssignModal');
    const assignmentForm = document.getElementById('assignmentForm');
    const topicSelect = document.getElementById('topicId');

    openAssignButton.addEventListener('click', async () => {
        assignModal.style.display = 'flex';
        topicSelect.innerHTML = '<option value="">Loading...</option>';

        try {
            const res = await fetch('/api/instructor/topics');
            const topics = await res.json();
            topicSelect.innerHTML = '<option value="">-- Select one --</option>';
            topics.forEach(t => {
                const option = document.createElement('option');
                option.value = t.topic_id;
                option.textContent = t.title;
                topicSelect.appendChild(option);
            });
        } catch (err) {
            console.error('Error loading topics for assignment:', err);
        }
    });

    closeAssignButton.addEventListener('click', () => assignModal.style.display = 'none');
    cancelAssignButton.addEventListener('click', () => assignModal.style.display = 'none');

    assignmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topicId = topicSelect.value;
        const studentId = document.getElementById('studentId').value;

        try {
            const res = await fetch('/api/instructor/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, studentId })
            });
            const result = await res.json();
            alert(result.message || 'Assignment complete');
            assignModal.style.display = 'none';
        } catch (err) {
            console.error('Error assigning topic:', err);
            alert('Failed to assign topic');
        }
    });
});
});