const express = require('express');
const htmlRoutes = require('./routes/htmlRoutes/index');
const fs = require('fs');
const path = require('path');

// represent POT to any route or to 3002
const PORT = process.env.PORT || 3002;

// creates the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded ({ extended: true}));
// parse incoming JSON data
app.use(express.json());

// middleware for public files that doesnt work????
app.use(express.static('public'));

// backup routes for html files that does work
app.use('/', htmlRoutes);
app.use('/notes', htmlRoutes);

const { notes } = require('./db/db.json');

function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
};

function validateNote (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

// get request to get all the notes and return as JSON
app.get('/api/notes', (req, res) => {
    res.json(notes);
});


// post request to send new note and return updated JSON with new note.
app.post('/api/notes', (req, res) => {

    // set id based on next index of array
    req.body.id = notes.length.toString();

    // if any incorrect data, send error
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted. Please ensure all fields are appropriately filled out.');
    } else {
        // add note to json file and notes array
        const note = createNewNote(req.body, notes);

        res.json(note);
    }
});

app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id;

    notes.map((selectedItem, index) => {
        if (selectedItem.id === id) {
            notes.splice(index, 1);
            return res.json(selectedItem);
        }
    })

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes : notes }, null, 2)
    )
    
    res.send(notes);
})



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
})