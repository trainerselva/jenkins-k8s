const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Welcome to the Kubernetes Cluster!'));
app.get('/:name', (req, res) => res.send(`Welcome ${req.params.name}`));
module.exports = app;
