const express = require('express');
const htmlRoutes = require('./routes/htmlRoutes/index');
const apiRoutes = require('./routes/apiRoutes/index');

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

// get request to get all the notes and return as JSON

app.get('/api/notes', (req, res) => {
    res.json(notes);
});





app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
})