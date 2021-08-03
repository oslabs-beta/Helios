const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const awsRouter = require('./routes/aws.js');
const userRouter = require('./routes/user.js');

const PORT = 4242;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(__dirname);

app.use(express.static(path.resolve(__dirname, '../client/src/Dashboard')));
app.use(express.static(path.resolve(__dirname, '../client/src')));

app.use('/build', express.static(path.resolve(__dirname, '../build')));
//Route all User related requests to User Router
app.use('/user', userRouter);

//Route all AWS requests to AWS router
app.use('/aws', awsRouter);

//server index.html for the root call
app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../public/index.html'));
});

// catch-all route handler for any requests
app.use((req, res) => {
  res.sendStatus(404);
});

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errObj = Object.assign(defaultErr, err);
  console.log('Error: ', errObj.log);
  res.status(errObj.status).send(errObj.message);
});

module.exports = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
