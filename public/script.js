const API_URL = '/notes';

async function loadNotes() {
    const response = await fetch(API_URL);
    const notes = await response.json();

    const container = document.getElementById('notes-container');

    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = '<p>No notes available. Create your first note!</p>';
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');

        card.className = 'note-card';

        const title = document.createElement('h3');
        title.textContent = note.title;

        const content = document.createElement('p');
        content.textContent = note.content;

        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.className = 'delete-btn';
        button.onclick = () => deleteNote(note.id);

        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(button);

        container.appendChild(card);
    });
}

async function addNote() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert('Please enter both title and content!');
        return;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.message || 'Unable to create note');
        return;
    }

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';

    loadNotes();
}

async function deleteNote(id) {
    const confirmDelete = confirm('Are you sure you want to delete this note?');

    if (!confirmDelete) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Unable to delete note');
        return;
    }

    loadNotes();
}

loadNotes();