const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const toyService = require('./services/toy.service');
const port = process.env.PORT || 3030;

const app = express();

// Express Config:
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
    ],
    credentials: true,
};
app.use(cors(corsOptions));

// Express Routing:

// LIST
app.get('/api/toy', (req, res) => {
    console.log('hi', req.query);

    // var { name, label, sort, inStock } = req.query

    const filterBy = {
        name: req.query.name || '',
        labels: req.query.labels || [],
        sort: req.query.sort || 'name',
        inStock : JSON.parse(req.query.inStock || 'false')
    };
    toyService.query(filterBy).then((toys) => {
        res.send(toys);
    });
});

// READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params;
    toyService.getById(toyId).then((toy) => {
        res.send(toy);
    });
});

// ADD
app.post('/api/toy', (req, res) => {
    const { name, price, inStock, createdAt, labels, reviews } = req.body;
    const toy = {
        name,
        price,
        inStock,
        createdAt,
        labels,
        reviews,
    };
    toyService.save(toy).then((savedToy) => {
        res.send(savedToy);
    });
});
// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
    const { name, price, _id, inStock, createdAt, labels, reviews } = req.body;

    const toy = {
        _id,
        name,
        price,
        inStock,
        createdAt,
        labels,
        reviews,
    };
    toyService.save(toy).then((savedToy) => {
        res.send(savedToy);
    });
});

// DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params;
    toyService.remove(toyId).then(() => {
        res.send('Removed!');
    });
});

// LOGIN
app.post('/login', (req, res) => {
    console.log('req.body:', req.body);
    res.cookie('user', req.body);
    res.send('logging  in');
});
app.post('/logout', (req, res) => {
    res.clearCookie('loggedInUser');
    res.clearCookie('user');
    res.send('logging  uot');
});

app.listen(port, () =>
    console.log(`Server listening on port ${port}`)
);
