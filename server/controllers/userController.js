const User = require('../Models/userModel');
const userController = {};

userController.createUser = (req, res, next) => {
  User.create(
    {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      arn: '',
    },
    (err, result) => {
      if (err) {
        console.log('create user error ', err);
        if (err.code === 11000) {
          console.log('duplicate password');
          res.locals.confirmation = { confirmation: false, email: false };
          return next();
        }
        return next(err);
      }
      console.log(result);
      res.locals.confirmation = { confirmation: true, email: true };
      return next();
    }
  );
};

userController.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.comparePassword(req.body.password)) {
      console.log('Compared Password worked');
      res.locals.confirmation = { confirmed: true };
      return next();
    } else {
      res.locals.confirmation = { confirmed: false };
      return next();
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

module.exports = userController;
