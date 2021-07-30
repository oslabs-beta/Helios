import React from 'react';
// @material-ui/core components
import { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import Dexie from 'dexie';
import db from '../../../indexedDB/mainIdb';
import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import CustomInput from '../../components/CustomInput/CustomInput.js';
import Button from '../../components/CustomButtons/Button.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardAvatar from '../../components/Card/CardAvatar.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import { connect } from 'react-redux';
import avatar from '../../assets/img/faces/marc.jpg';
import logo from '../../assets/img/helios-logo-background.jpg';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import SnackbarContent from '../../components/Snackbar/SnackbarContent.js';
import Snackbar from '../../components/Snackbar/Snackbar.js';
import AddAlert from '@material-ui/icons/AddAlert';
import getArnArrayIDB from '../../../indexedDB/getArnArrayIDB.js';
import getUserInfoArrayIDB from '../../../indexedDB/getUserInfo.js';
import updateArnIDB from '../../../indexedDB/updateArnIDB';
import updateUserInfoIDB from '../../../indexedDB/updateUserInfoIDB';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  primaryColor,
  dangerColor,
  successColor,
  grayColor,
  defaultFont,
  infoColor,
} from '../../assets/jss/material-dashboard-react';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  cardTitle: {
    textAlign: 'left',
  },
  root: {
    '& label.Mui-focused': {
      color: 'blue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'blue',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
  },
};

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: infoColor[0],
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: infoColor[0],
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: infoColor[0],
      },
    },
  },
})(TextField);

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  userInfo: state.main,
});

function UserProfile(props) {
  const [updateProfile, displayUpdateProfile] = useState(true);
  const [origArn, displayArn] = useState('');
  const [dbName, addDbName] = useState('');
  const [dbEmail, addDbEmail] = useState('');
  const [updatedArn, updateArn] = useState('');
  const [updatedEmail, updateEmail] = useState('');
  const [originalEmail, updateOriginalEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
  const classes = useStyles();
  const [successNotification, setSuccessNotification] = useState(false);
  const [failureNotification, setFailureNotification] = useState(false);
  const [passwordFailNotification, setPasswordFailNotification] =
    useState(false);
  const arnArray = useLiveQuery(getArnArrayIDB);
  const userInfoArray = useLiveQuery(getUserInfoArrayIDB);

  useEffect(() => {
    if (arnArray && arnArray[0]) {
      displayArn(arnArray[0].arn);
    }
  }, [arnArray]);

  useEffect(() => {
    if (userInfoArray && userInfoArray[0]) {
      addDbName(userInfoArray[0].firstName);
      addDbEmail(userInfoArray[0].email);
    }
  }, [userInfoArray]);

  const handleUpdateEmail = () => {
    if (updatedEmail.trim() === '') {
      showNotification('failure');
      return;
    }
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountEmail: dbEmail,
        originalEmail: originalEmail,
        newEmail: updatedEmail,
      }),
    };

    fetch('/user/updateEmail', reqParams)
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status) {
          showNotification('success');
          updateUserInfoIDB({
            firstName: dbName,
            email: response.newEmail,
          }).catch((error) => {
            console.error('error while updating user info', error);
          });
        } else {
          showNotification('failure');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    updateEmail('');
    updateOriginalEmail('');
  };

  const handleUpdateArn = () => {
    if (updatedArn.trim() === '') {
      showNotification('failure');
      return;
    }
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dbEmail, newArn: updatedArn }),
    };

    fetch('/user/updateArn', reqParams)
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status) {
          showNotification('success');
          updateArnIDB({ arn: updatedArn }).catch((error) => {
            console.error('error while updating arn', error);
          });
        } else {
          showNotification('failure');
        }
      })
      .catch((err) =>
        console.log('Error in updating arn on User Profile: ', err)
      );
    updateArn('');
  };

  const handleUpdatePassword = () => {
    if (newPassword.trim() === '' || oldPassword.trim() === '') {
      showNotification('failure');
      return;
    }
    if (newPassword !== confirmedNewPassword) {
      showNotification('passwordFail');
      return;
    }
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dbEmail, oldPassword, newPassword }),
    };

    fetch('/user/updatePassword', reqParams)
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status) {
          showNotification('success');
        } else {
          showNotification('failure');
        }
      })
      .catch((err) => {
        console.log('Error in updating password on User Profile: ', err);
        showNotification('passwordFail');
      });

    setOldPassword('');
    setNewPassword('');
    setConfirmedNewPassword('');
  };

  const showNotification = (place) => {
    switch (place) {
      case 'failure':
        if (!failureNotification) {
          setFailureNotification(true);
          setTimeout(function () {
            setFailureNotification(false);
          }, 6000);
        }
        break;
      case 'success':
        if (!successNotification) {
          setSuccessNotification(true);
          setTimeout(function () {
            setSuccessNotification(false);
          }, 6000);
        }
        break;
      case 'passwordFail':
        if (!passwordFailNotification) {
          setPasswordFailNotification(true);
          setTimeout(function () {
            setPasswordFailNotification(false);
          }, 6000);
        }
        break;

      default:
        break;
    }
  };
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <img src={logo} alt='Helios' />
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                <big>Your Name: </big>
                <br />
                {dbName}
              </h4>
              <h5 className={classes.cardTitle}>
                <big>Your Email: </big>
                <br />
                {dbEmail}
              </h5>
              <h5 className={classes.cardTitle}>
                <big>AWS Helios Delegation Role: </big>
                <br />
                {origArn}
              </h5>
            </CardBody>
          </Card>
        </GridItem>
        <Snackbar
          place='tc'
          color='success'
          icon={AddAlert}
          message='You have successfully updated your profile.'
          open={successNotification}
          closeNotification={() => setSuccessNotification(false)}
          close
        />
        <Snackbar
          place='tc'
          color='danger'
          icon={AddAlert}
          message='Uh oh, something went wrong! Please try again!'
          open={failureNotification}
          closeNotification={() => setFailureNotification(false)}
          close
        />
        <Snackbar
          place='tc'
          color='danger'
          icon={AddAlert}
          message='Please make sure your passwords match and try again.'
          open={passwordFailNotification}
          closeNotification={() => setPasswordFailNotification(false)}
          close
        />
        {updateProfile && (
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardBody>
                <GridContainer>
                  <Card>
                    <CardHeader color='info'>
                      <h4 className={classes.cardTitleWhite}>Update Email</h4>
                    </CardHeader>
                    <CardBody>
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          label='Old Email'
                          id='old-email'
                          autoComplete='email'
                          fullWidth
                          value={originalEmail}
                          onChange={(e) => {
                            updateOriginalEmail(e.target.value);
                          }}
                        />
                      </GridItem>
                      <br />
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          label='New Email'
                          id='new-email'
                          autoComplete='email'
                          fullWidth
                          value={updatedEmail}
                          onChange={(e) => {
                            updateEmail(e.target.value);
                          }}
                        />
                      </GridItem>
                    </CardBody>
                    <CardFooter>
                      <Button color='success' onClick={handleUpdateEmail}>
                        Update Email
                      </Button>
                    </CardFooter>
                  </Card>
                </GridContainer>
                <GridContainer>
                  <Card>
                    <CardHeader color='info'>
                      <h4 className={classes.cardTitleWhite}>
                        Update Linked AWS Account
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <GridItem xs={11} sm={11} md={11}>
                        <Typography
                          variant='body1'
                          style={{ color: '#AAAAAA' }}
                        >
                          Connect a different AWS account with Helios by
                          creating a new CloudFormation stack below and updating
                          your account.
                          <ol>
                            <li>
                              <a
                                target='_blank'
                                href='https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=helios-delegation&templateURL=https://project-helios-template.s3.us-east-2.amazonaws.com/cloudformationHelios.yaml'
                                className={classes.awsLink}
                              >
                                Add Helios CloudFormation stack to AWS
                                <OpenInNew
                                  style={{ color: '#AAAAAA', height: '15px' }}
                                />
                              </a>
                            </li>
                            <li>
                              Make sure you check "I acknowledge that AWS
                              CloudFormation might create IAM resources.
                            </li>
                            <li>Click "Create"</li>
                            <li>
                              Wait until the stack creation completes. Then head
                              to the "Outputs" tab. Copy the "ARN" value below!
                            </li>
                          </ol>
                        </Typography>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          className={classes.margin}
                          id='new-arn'
                          label='New ARN'
                          fullWidth
                          value={updatedArn}
                          onChange={(e) => {
                            updateArn(e.target.value);
                          }}
                        />
                      </GridItem>
                    </CardBody>
                    <CardFooter>
                      <Button color='success' onClick={handleUpdateArn}>
                        Update ARN
                      </Button>
                    </CardFooter>
                  </Card>
                </GridContainer>
                <GridContainer>
                  <Card>
                    <CardHeader color='info'>
                      <h4 className={classes.cardTitleWhite}>
                        Change Password
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          label='Old Password'
                          type='password'
                          id='old-password'
                          autoComplete='password'
                          fullWidth
                          value={oldPassword}
                          onChange={(e) => {
                            setOldPassword(e.target.value);
                          }}
                        />
                      </GridItem>
                      <br />
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          label='New Password'
                          id='new-password'
                          type='password'
                          fullWidth
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                        />
                      </GridItem>
                      <br />
                      <GridItem xs={12} sm={12} md={6}>
                        <CssTextField
                          label='Confirm New Password'
                          id='confirm-new-password'
                          type='password'
                          fullWidth
                          value={confirmedNewPassword}
                          onChange={(e) => {
                            setConfirmedNewPassword(e.target.value);
                          }}
                        />
                      </GridItem>
                    </CardBody>
                    <CardFooter>
                      <Button color='success' onClick={handleUpdatePassword}>
                        Change Password
                      </Button>
                    </CardFooter>
                  </Card>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </GridContainer>
    </div>
  );
}
export default connect(mapStateToProps, null)(UserProfile);
