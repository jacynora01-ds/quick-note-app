const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const file = path.join(__dirname, 'data', 'notes.json');

function getNotes() {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// GET - Display all notes
app.get('/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
});

// POST - Create a new note
app.post('/notes', (req, res) => {
    const notes = getNotes();
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: 'Title and content are required'
        });
    }

    const newNote = {
        id: Date.now(),
        title: title,
        content: content
    };

    notes.push(newNote);

    fs.writeFileSync(file, JSON.stringify(notes, null, 2));

    res.status(201).json({
        message: 'Note created successfully',
        note: newNote
    });
});

// DELETE - Delete a note
app.delete('/notes/:id', (req, res) => {
    const notes = getNotes();
    const id = Number(req.params.id);

    const updatedNotes = notes.filter(note => note.id !== id);

    if (notes.length === updatedNotes.length) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    fs.writeFileSync(file, JSON.stringify(updatedNotes, null, 2));

    res.json({
        message: 'Note deleted successfully'
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});