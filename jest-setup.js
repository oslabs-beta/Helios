import 'regenerator-runtime/runtime';
module.exports = async () => {
  global.testServer = await require('./server/server');
};
