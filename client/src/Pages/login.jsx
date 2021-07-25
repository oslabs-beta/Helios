import React from "react";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from '@material-ui/core/Link';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// import { addLoginInfo } from '../Actions/actions';
import * as actions from "../Actions/actions";
import updateIDBSignIn from "../indexedDB/updateIDBSignIn";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <a href="https://github.com/oslabs-beta/Helios" target="_blank">
        Helios
      </a>
      {" " + new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoImg: {
    width: "300px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mapDispatchToProps = (dispatch) => ({
  addLoginInfo: (userInfo) => dispatch(actions.addLoginInfo(userInfo)),
});

function SignIn(props) {
  const classes = useStyles();
  const history = useHistory();
  const [unconfirmed, setConfirmed] = useState(false);
  let email = "";
  let password = "";

  function handleSubmit() {
    const reqParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    updateIDBSignIn({ email, password })
      .then((user) => {
        console.log("updateIDPSignIn" + user);
      })
      .catch((error) => {
        console.log("error sign in to stored data", error);
      });

    fetch("/user/login", reqParams)
      .then((res) => res.json())
      .then((confirmation) => {
        if (confirmation.confirmed) {
          props.addLoginInfo(confirmation.userInfo);
          history.push("/admin");
        } else {
          setConfirmed(true);
        }
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}> */}
        {/* <LockOutlinedIcon /> */}
        <img
          alt="Helios Logo"
          src="../Dashboard/assets/img/helios-black-logo-t.png"
          className={classes.logoImg}
        />
        {/* </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {unconfirmed && (
          <Typography style={{ color: "red" }}>
            Please double-check your email and/or password or create a new
            account.
          </Typography>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => {
            email = e.target.value;
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => {
            password = e.target.value;
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link to="/user/signup" variant="body2">
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
