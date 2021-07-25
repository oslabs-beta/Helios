import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
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
import * as actions from "../Actions/actions";
import updateIDBSignUp from "../indexedDB/updateIDBSignUp";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mapDispatchToProps = (dispatch) => ({
  addUserInfo: (userInfo) => dispatch(actions.addUserInfo(userInfo)),
});

function SignUp(props) {
  const history = useHistory();
  const [invalidEmail, setValidEmail] = useState(false);
  const classes = useStyles();
  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";

  function handleSubmit() {
    const reqParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, password, email }),
    };
    fetch("/user/signup", reqParams)
      .then((res) => res.json())
      .then((response) => {
        if (response.confirmation && response.emailStatus) {
          props.addUserInfo(response.userInfo);
          history.push("/user/register");

          // save once signed up is confirmed
          updateIDBSignUp({ firstName, lastName, email, password })
            .then((user) => {
              console.log("updateIDPSignUp" + user);
            })
            .catch((error) => {
              console.log("error sign up to stored data", error);
            });
        } else if (!response.emailStatus) {
          setValidEmail(true);
        }
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <img
          alt="Helios Logo"
          src="../Dashboard/assets/img/helios-black-logo-t.png"
          className={classes.logoImg}
        />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              onChange={(e) => {
                firstName = e.target.value;
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              onChange={(e) => {
                lastName = e.target.value;
              }}
            />
          </Grid>
          {invalidEmail && (
            <Typography style={{ color: "red" }}>
              This email has been taken already.
            </Typography>
          )}
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => {
                email = e.target.value;
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default connect(null, mapDispatchToProps)(SignUp);
