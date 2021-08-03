import React from 'react';
import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import logo from '../Dashboard/assets/img/helios-blue-logo-t.png';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import { addLoginInfo } from '../Actions/actions';
import * as actions from '../Actions/actions';
import updateUserInfoIDB from '../indexedDB/updateUserInfoIDB';
import updateArnIDB from '../indexedDB/updateArnIDB';
import updateRegionIDB from '../indexedDB/updateRegionIDB';

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

function SignIn(props) {
  const classes = useStyles();
  const history = useHistory();
  const [unconfirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // handles login request
  // makes sure password matches provided email and then adds details to state + IndexedDB and pushes them to the dashboard
  function handleSubmit() {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    };

    fetch('/user/login', reqParams)
      .then((res) => res.json())
      .then((confirmation) => {
        if (confirmation.confirmed) {
          props.addLoginInfo(confirmation.userInfo);

          const { firstName, email, arn, region } = confirmation.userInfo;

          updateArnIDB({ arn }).catch((error) => {
            console.error('error while updating login arn', error);
          });

          updateUserInfoIDB({ firstName, email }).catch((error) => {
            console.error('error while updating login user info', error);
          });

          updateRegionIDB({ region }).catch((error) => {
            console.error('error while updating region info', error);
          });
          history.push('/admin');
        } else {
          setConfirmed(true);
          password.value = '';
          email.value = '';
        }
      });
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <img alt='Helios Logo' src={logo} className={classes.logoImg} />

        <Typography component='h1' variant='h5' className={classes.pageText}>
          Sign in
        </Typography>
        {unconfirmed && (
          <Typography style={{ color: 'red' }}>
            Please double-check your email and/or password or create a new
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
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          className={classes.submit}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link
              to='/user/forgotPassword'
              variant='body2'
              className={classes.pageText}
            >
              Forgot password?
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

export default connect(null, mapDispatchToProps)(SignIn);
