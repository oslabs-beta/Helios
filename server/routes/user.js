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

router.route('/updateRegion').post(userController.updateRegion, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

router.route('/updateArn').post(userController.updateArn, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

router.route('/updateEmail').post(userController.updateEmail, (req, res) => {
  res.status(200).json(res.locals.confirmation);
});

router
  .route('/updatePassword')
  .post(userController.updatePassword, (req, res) => {
    res.status(200).json(res.locals.confirmation);
  });

router
  .route('/forgotPassword')
  .post(userController.forgotPassword, (req, res) => {
    res.status(200).json(res.locals.confirmation);
  });

router
  .route('/resetPassword')
  .post(userController.resetPassword, (req, res) => {
    res.status(200).json(res.locals.confirmation);
  });

router
  .route('/verifyAccount')
  .post(userController.checkVerificationCode, (req, res) => {
    res.status(200).json(res.locals.confirmation);
  });

module.exports = router;
