const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.route('/signup').post(userController.createUser, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

router.route('/login').post(userController.verifyUser, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

router.route('/register').post(userController.addArn, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
