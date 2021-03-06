const { User, PasswordReset } = require('../Models/userModel');
const userController = {};
const sendEmail = require('./user/nodemailer');
const { v4 } = require('uuid');

// handle when a user requests to change their ARN
userController.updateArn = async (req, res, next) => {
  // find and update account in database
  try {
    const origUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { arn: req.body.newArn }
    );
    // makes sure the user document was updated with new ARN
    const doubleCheck = await User.findOne({ email: req.body.email });
    if (doubleCheck) {
      if (doubleCheck.arn === req.body.newArn) {
        res.locals.confirmation = { status: true, arn: doubleCheck.arn };
        return next();
      }
      // if not, sends a false status back to notify user something went wrong
    } else {
      res.locals.confirmation = { status: false };
      return next();
    }
  } catch (err) {
    if (err) console.error(err);
    return next(err);
  }
};

// create a new user in database
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
        // if error code is 11000 it means an account already exists, so we notify user
        if (err.code === 11000) {
          res.locals.confirmation = { confirmation: false, email: false };
          return next();
        }
        return next(err);
      }
      // otherwise, if it works we send them a confirmation
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

// verifies user exists and password matches in database during login
userController.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // compare provided password with the hashed one
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
      console.error(err);
      return next(err);
    }
  }
};

// adds arn and region from the registration page to the user's account details
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
      console.error(err);
      return next(err);
    }
  }
};

// handles when a user requests to change their default region
userController.updateRegion = async (req, res, next) => {
  const confirmation = {};
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { region: req.body.newRegion },
      { new: true }
    );
    if (updatedUser) {
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
    if (err) console.error(err);
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
    console.error(err);
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
    console.error(err);
    return next(err);
  }
};

// start forgot password process
userController.forgotPassword = async (req, res, next) => {
  const confirmation = {};
  try {
    // make sure user exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // create unique security token to email to them
      const token = v4().toString().replace(/-/g, '');
      // associate a new document in the PasswordReset collection with user ID and the token
      // if it already exists, we update the token, if it doesn't already exist, we create it with upsert
      const updateDB = await PasswordReset.updateOne(
        { user: user._id },
        { user: user._id, token: token },
        { upsert: true }
      );
      // send an email with the token to the email provided
      const emailStatus = sendEmail('passwordReset', req.body.email, token);
      // send confirmation so frontend can display a place to enter the token
      confirmation.status = true;
      res.locals.confirmation = confirmation;
      return next();
    }
  } catch (err) {
    if (err) console.error(err);
    return next(err);
  }
};

// once user supplies token, verify it's correct
userController.checkVerificationCode = async (req, res, next) => {
  const confirmation = {};
  try {
    const token = req.body.verificationCode;
    const passwordReset = await PasswordReset.findOne({ token });
    // if token works, send confirmation so they can reset their password
    if (passwordReset) {
      confirmation.status = true;
    }
    res.locals.confirmation = confirmation;
    return next();
  } catch (err) {
    if (err) console.error(err);
    return next(err);
  }
};

// handles actually resetting password for account
userController.resetPassword = async (req, res, next) => {
  const confirmation = {};
  try {
    // checks token again
    const token = req.body.verificationCode;
    const passwordReset = await PasswordReset.findOne({ token });
    // find user document associated with the token's user ID
    let user = await User.findOne({ _id: passwordReset.user });
    // update password and then delete the PasswordReset document
    user.password = req.body.password;
    user.save().then(async (savedUser) => {
      await PasswordReset.deleteOne({ _id: passwordReset._id });
    });
    confirmation.status = true;
    res.locals.confirmation = confirmation;
    return next();
  } catch (err) {
    if (err) console.error(err);
    return next(err);
  }
};

module.exports = userController;
