'use strict';

const express = require('express');
const RouterService = require('./services/router.service');
const postsRouter = new RouterService('posts', 'id', ['userId', 'title', 'body']).router;

const app = express();
app.use(express.json());                          // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));  // to support URL-encoded bodies
app.use('/posts', postsRouter);

app.use((req, res, next) => {
  let err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Client is available at http://localhost:${PORT}`));
