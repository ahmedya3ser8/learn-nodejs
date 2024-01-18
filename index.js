require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // static images

const mongoose = require('mongoose');
const cors = require('cors');

const url = process.env.MONGO_URL;
// url --> / (dbname) ?

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors()); // Cross Origin Resource Sharing

app.use(express.json()); // middleware for req.body


const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
