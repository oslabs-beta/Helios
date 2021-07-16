const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('/signup', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('/test', (req, res) => {
  console.log('HIT');
  return res.status(200).json({ test: 'hellooo' });
});

module.exports = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
