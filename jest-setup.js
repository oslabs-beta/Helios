import 'regenerator-runtime/runtime';
module.exports = async () => {
  console.log('starting');
  global.testServer = await require('./server/server');
};
