import React from 'react';
import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as actions from '../Actions/actions';
import Snackbar from '../Dashboard/components/Snackbar/Snackbar';
import AddAlert from '@material-ui/icons/AddAlert';
import logo from '../Dashboard/assets/img/helios-blue-logo-t.png';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <a href='https://github.com/oslabs-beta/Helios' target='_blank'>
        Helios
      </a>
      {' ' + new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoImg: {
    width: '410px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#2A3C4A',
    color: '#FFFFFF',
  },
  pageText: {
    color: '#2A3C4A',
  },
}));

const mapDispatchToProps = (dispatch) => ({
  addLoginInfo: (userInfo) => dispatch(actions.addLoginInfo(userInfo)),
});

function ForgotPassword(props) {
  const classes = useStyles();
  const history = useHistory();
  const [unconfirmed, setConfirmed] = useState(false);
  const [verifOpen, openVerif] = useState(false);
  const [reset, openReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [incorrectVerificationCode, setIncorrectVerificationCode] =
    useState(false);
  const [successNotification, setSuccessNotification] = useState(false);
  const [passwordsMatch, setPasswordMatch] = useState(true);

  // user enters password and clicks reset password
  function handleSubmit() {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    };
    // send to backend and make sure user exists and sends verification code to their email
    fetch('/user/forgotPassword', reqParams)
      .then((res) => res.json())
      .then((confirmation) => {
        // if they exist modal for submitting the emailed verification code opens
        if (confirmation.status) {
          openVerif(true);
        } else {
          // if they don't exist, an error pops up
          setConfirmed(true);
          email.value = '';
        }
      })
      .catch((err) => {
        console.error(
          'Error in sending email address to request a password reset',
          err
        );
      });
  }

  // exit out of verification code modal
  const handleVerifClose = () => {
    openVerif(false);
  };

  // after user submits verification code
  const handleVerify = () => {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verificationCode }),
    };
    // send to backend and verify it's the correct code associated with the user's account
    fetch('/user/verifyAccount', reqParams)
      .then((res) => res.json())
      .then((response) => {
        // if successful, new modal opens up for them to reset password
        if (response.status) {
          openReset(true);
          openVerif(false);
          // if incorrect code, error pops up letting them know
        } else {
          setIncorrectVerificationCode(true);
        }
      })
      .catch((err) => console.error('Error in verifying account:', err));
  };

  // handles submission of new password to update the user's account in database
  const handleResetPassword = () => {
    // if password is entered in twice correctly, an error pops up
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      password.value = '';
      email.value = '';
      return;
    }
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, verificationCode }),
    };
    // sends request to backend to update
    fetch('/user/resetPassword', reqParams)
      .then((res) => res.json())
      .then((confirmation) => {
        if (confirmation.status) {
          openReset(false);
          showNotification('success');
        } else {
          password.value = '';
          email.value = '';
        }
      })
      .catch((err) =>
        console.error('Error in resetting password request', err)
      );
  };

  // after change password is successful, a success notification pops up and then redirects user to login page after 6 seconds
  const showNotification = (status) => {
    switch (status) {
      case 'success':
        if (!successNotification) {
          setSuccessNotification(true);
          setTimeout(function () {
            setSuccessNotification(false);
            history.push('/');
          }, 6000);
        }
        break;

      default:
        break;
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <img alt='Helios Logo' src={logo} className={classes.logoImg} />

        {/* Success notification */}
        <Snackbar
          place='tc'
          color='success'
          icon={AddAlert}
          message='You have successfully reset your password and will be redirected to the login page in a few seconds.'
          open={successNotification}
        />

        {/* Pop up modal that's triggered after user enters their email and is the spot they can enter the verification code emailed to them */}
        <Dialog
          open={verifOpen}
          onClose={handleVerifClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title' className={classes.pageText}>
            Verify Your Email
          </DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.pageText}>
              Enter the verification code emailed to you. If you don't receive
              it in the next few minutes, please check your spam folder.
            </DialogContentText>
            {incorrectVerificationCode && (
              <Typography style={{ color: 'red' }}>
                Please double-check you entered in the correct verification
                code.
              </Typography>
            )}
            <TextField
              autoFocus
              margin='dense'
              id='verifCode'
              label='Verification Code'
              fullWidth
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVerifClose} className={classes.submit}>
              Cancel
            </Button>
            <Button onClick={handleVerify} className={classes.submit}>
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pop up modal that's triggered after the correct verification code has been entered so user can choose a new password */}
        <Dialog
          open={reset}
          onClose={() => {
            openReset(false);
          }}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title' className={classes.pageText}>
            Reset Your Password
          </DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.pageText}>
              Reset your password below.
            </DialogContentText>

            {/* If passwords don't match an error pops up */}
            {!passwordsMatch && (
              <Typography style={{ color: 'red' }}>
                Your passwords must match.
              </Typography>
            )}
            <TextField
              autoFocus
              margin='dense'
              id='password'
              label='New Password'
              type='password'
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin='dense'
              id='confirmPassword'
              label='Confirm New Password'
              type='password'
              fullWidth
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                openReset(false);
              }}
              className={classes.submit}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className={classes.submit}>
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>

        <Typography component='h1' variant='h5'>
          Reset Your Password
        </Typography>
        {unconfirmed && (
          <Typography style={{ color: 'red' }}>
            Please double-check the email you provided or sign up for a new
            account.
          </Typography>
        )}
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          className={classes.submit}
          onClick={handleSubmit}
        >
          Reset My Password
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to='/' variant='body2' className={classes.pageText}>
              Remembered your password?
            </Link>
          </Grid>
          <Grid item>
            <Link
              to='/user/signup'
              variant='body2'
              className={classes.pageText}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default connect(null, mapDispatchToProps)(ForgotPassword);
