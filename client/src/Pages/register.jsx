import React from "react";
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
import * as actions from "../Actions/actions";
import updateArnIDB from "../indexedDB/updateArnIDB";

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

const mapStateToProps = (state) => ({
  userEmail: state.main.email,
  main: state.main,
});

const mapDispatchToProps = (dispatch) => ({
  addArn: (userInfo) => dispatch(actions.addArn(userInfo)),
});

function Register(props) {
  const classes = useStyles();
  const history = useHistory();
  console.log(props.userEmail);

  let arn = "";
  let email = props.userEmail;

  const handleRegisterBtn = () => {
    console.log(props.main);
    const reqParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, arn }),
    };

    fetch("/user/register", reqParams)
      .then((data) => {
        console.log("Registered");
        props.addArn(arn);
        updateArnIDB({ arn }).catch((error) => {
          console.error("error while updating arn", error);
        });
        history.push("/admin");

        // TO DO SAVE ARN IN IDB
      })
      .catch((err) => console.log(err));
  };

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
          Connect your AWS account
          <br />
        </Typography>
        <br />
        <Typography variant="body1">
          It's quick and easy to connect your AWS account to Helios! Just follow
          the below steps and we'll get you all set up!
          <ol>
            <li>
              <a
                target="_blank"
                href="https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=helios-delegation&templateURL=https://project-helios-template.s3.us-east-2.amazonaws.com/cloudformationHelios.yaml"
              >
                Add Helios CloudFormation stack to AWS
              </a>
            </li>
            <li>
              Make sure you check "I acknowledge that AWS CloudFormation might
              create IAM resources.
            </li>
            <li>Click "Create"</li>
            <li>
              Wait until the stack creation completes. Then head to the
              "Outputs" tab. Copy the "ARN" value below!
            </li>
          </ol>
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="arn"
          label="ARN"
          name="arn"
          autoFocus
          onChange={(e) => {
            arn = e.target.value;
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleRegisterBtn}
        >
          Register Your Account
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
