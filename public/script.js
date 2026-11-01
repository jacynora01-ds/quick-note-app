const API_URL = '/notes';

async function loadNotes() {
    const container = document.getElementById('notesContainer');

    try {
        const response = await fetch(API_URL);
        const notes = await response.json();

        container.innerHTML = '';

        if (notes.length === 0) {
            container.innerHTML = '<p class="empty-message">No notes yet. Create your first note!</p>';
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const title = document.createElement('h3');
            title.textContent = note.title;

            const content = document.createElement('p');
            content.textContent = note.content;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => deleteNote(note.id);

            card.appendChild(title);
            card.appendChild(content);
            card.appendChild(deleteButton);

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p class="empty-message">Unable to load notes.</p>';
        console.error(error);
    }
}

async function addNote() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('Please enter both title and content.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        if (!response.ok) {
            alert('Unable to create note.');
            return;
        }

        titleInput.value = '';
        contentInput.value = '';

        loadNotes();

    } catch (error) {
        alert('Something went wrong.');
        console.error(error);
    }
}

async function deleteNote(id) {
    const confirmDelete = confirm('Are you sure you want to delete this note?');

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert('Unable to delete note.');
            return;
        }

        loadNotes();

    } catch (error) {
        alert('Something went wrong.');
        console.error(error);
    }
}

loadNotes();