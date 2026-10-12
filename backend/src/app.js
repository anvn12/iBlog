require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', postsRouter);
app.use('/', commentsRouter);
app.use('/', usersRouter);


// Not found handler (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})
