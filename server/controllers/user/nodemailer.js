const nodemailer = require('nodemailer');

const sendEmail = (type, recipient, resetToken) => {
  // link to your email to be the "sender"
  const Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: 'projecthelios2021@gmail.com', pass: 'Helios_cs' },
  });
  let mailOptions;
  let sender = 'Helios';
  let content;
  // email content for changing email
  if (type === 'emailChange') {
    content = `<h4>Your email associated with Helios has been successfully updated.</h4> <p>Thank you for choosing Helios to monitor your serverless application!</p><p>From now on, your login will be associated with the new email you provided us.</p><p>- <a href="https://github.com/oslabs-beta/Helios">The Helios Team</a></p>`;
    mailOptions = {
      from: sender,
      to: recipient,
      subject: 'Your Email Has Been Updated',
      html: content,
    };
    // email content for changing password
  } else if (type === 'passwordChange') {
    content = `<h4>Your password associated with Helios has been successfully updated.</h4> <p>Thank you for choosing Helios to monitor your serverless application!</p><p>From now on, your login will be associated with the new password you provided us.</p><p>- <a href="https://github.com/oslabs-beta/Helios">The Helios Team</a></p>`;
    mailOptions = {
      from: sender,
      to: recipient,
      subject: 'Your Password Has Been Updated',
      html: content,
    };
  } else if (type === 'passwordReset') {
    content = `<h4>A password reset has been requested.</h4> <p>Thank you for choosing Helios to monitor your serverless application!</p><p>Please copy the below code to reset your account password:</p><p>${resetToken}</p><p>- <a href="https://github.com/oslabs-beta/Helios">The Helios Team</a></p>`;
    mailOptions = {
      from: sender,
      to: recipient,
      subject: 'Reset Your Password',
      html: content,
    };
  }
  // send the email
  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      return { status: false, error: error };
    } else {
      console.log('Message Sent');
      return { status: true };
    }
  });
};

module.exports = sendEmail;
