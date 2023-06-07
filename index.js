const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();


// here are the middleware

app.use(cors())
app.use(express)

app.get('/', (req, res) => {
    res.send('Toy house Running successfully');
})
app.listen(port, () => {
    console.log('listening to port ', port);
})