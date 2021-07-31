const { User, PasswordReset } = require('../Models/userModel');
const userController = {};
const sendEmail = require('./user/nodemailer');
const { v4 } = require('uuid');

userController.updateArn = async (req, res, next) => {
  console.log(req.body);

  try {
    const origUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { arn: req.body.newArn }
    );
    const doubleCheck = await User.findOne({ email: req.body.email });
    if (doubleCheck) {
      res.locals.confirmation = { status: true, arn: doubleCheck.arn };
      return next();
    } else {
      res.locals.confirmation = { status: false };
      return next();
    }
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

userController.createUser = (req, res, next) => {
  console.log(req.body);
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
      res.locals.confirmation = {
        confirmation: true,
        emailStatus: true,
        userInfo: {
          email: result.email,
          firstName: result.firstName,
        },
      };
      return next();
    }
  );
};

userController.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (await user.comparePassword(req.body.password)) {
      res.locals.confirmation = {
        confirmed: true,
        userInfo: {
          email: user.email,
          firstName: user.firstName,
          arn: user.arn,
          region: user.region,
        },
      };
      return next();
    } else {
      res.locals.confirmation = {
        confirmed: false,
      };
      return next();
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

userController.addArn = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { arn: req.body.arn, region: req.body.regionSelect },
      { new: true }
    );
    return next();
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

userController.updateRegion = async (req, res, next) => {
  const confirmation = {};
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { region: req.body.newRegion },
      { new: true }
    );
    if (updatedUser) {
      console.log('Updated user with new region: ', updatedUser);
      confirmation.status = true;
      confirmation.region = updatedUser.region;
      res.locals.confirmation = confirmation;
      return next();
    } else {
      confirmation.status = false;
      res.locals.confirmation = confirmation;
      return next();
    }
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

userController.updateEmail = async (req, res, next) => {
  const confirmation = {};
  // if the email from indexedDB doesn't match the original email they provided/the one they're currently
  // logged in with, don't move on
  if (req.body.accountEmail !== req.body.originalEmail) {
    confirmation.status = false;
    res.locals.confirmation = confirmation;
    return next();
  }
  // if emails match, update email in database
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.originalEmail },
      { email: req.body.newEmail },
      { new: true }
    );
    // if update is successful, send a confirmed status back and the new email to update
    // in indexedDB
    if (updatedUser) {
      confirmation.status = true;
      confirmation.newEmail = updatedUser.email;
    }
    res.locals.confirmation = confirmation;
    // send a confirmation of email update to the account's original email
    const emailStatus = sendEmail('emailChange', req.body.originalEmail);
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

userController.updatePassword = async (req, res, next) => {
  const confirmation = {};
  // find account associated with the logged in user
  try {
    let user = await User.findOne({ email: req.body.email });
    // if the provided original password matches the one in the database
    // update and save the new password
    if (await user.comparePassword(req.body.oldPassword)) {
      user.password = req.body.newPassword;
      user.save();
      confirmation.status = true;
      // if password succesfully changed, send conf
      const emailStatus = sendEmail('passwordChange', req.body.email);
      res.locals.confirmation = confirmation;
      return next();
    }
    // if unsuccessful send false status to frontend to display an error message
    confirmation.status = false;
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

userController.forgotPassword = async (req, res, next) => {
  const confirmation = {};
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = v4().toString().replace(/-/g, '');
      console.log('token: ', token);
      const updateDB = await PasswordReset.updateOne(
        { user: user._id },
        { user: user._id, token: token },
        { upsert: true }
      );
      const emailStatus = sendEmail('passwordReset', req.body.email, token);
      confirmation.status = true;
      res.locals.confirmation = confirmation;
      return next();
    }
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

userController.checkVerificationCode = async (req, res, next) => {
  console.log(req.body);
  const confirmation = {};
  try {
    const token = req.body.verificationCode;
    const passwordReset = await PasswordReset.findOne({ token });
    if (passwordReset) {
      confirmation.status = true;
    }
    res.locals.confirmation = confirmation;
    return next();
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

userController.resetPassword = async (req, res, next) => {
  console.log(req.body);
  const confirmation = {};
  try {
    const token = req.body.verificationCode;
    const passwordReset = await PasswordReset.findOne({ token });
    let user = await User.findOne({ _id: passwordReset.user });
    user.password = req.body.password;
    user.save().then(async (savedUser) => {
      await PasswordReset.deleteOne({ _id: passwordReset._id });
    });
    confirmation.status = true;
    res.locals.confirmation = confirmation;
    return next();
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

module.exports = userController;
