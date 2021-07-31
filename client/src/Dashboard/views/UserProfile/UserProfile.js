import React from 'react';
// @material-ui/core components
import { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import { regions } from '../../variables/regions.js';

import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import CustomInput from '../../components/CustomInput/CustomInput.js';
import Button from '../../components/CustomButtons/Button.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardAvatar from '../../components/Card/CardAvatar.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import avatar from '../../assets/img/faces/marc.jpg';
import logo from '../../assets/img/helios-logo-background.jpg';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OpenInNew from '@material-ui/icons/OpenInNew';
import EditLocation from '@material-ui/icons/EditLocation';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Snackbar from '../../components/Snackbar/Snackbar.js';
import AddAlert from '@material-ui/icons/AddAlert';
import getArnArrayIDB from '../../../indexedDB/getArnArrayIDB.js';
import getUserInfoArrayIDB from '../../../indexedDB/getUserInfo.js';
import getRegionIDB from '../../../indexedDB/getRegionIDB';
import updateRegionIDB from '../../../indexedDB/updateRegionIDB';
import updateArnIDB from '../../../indexedDB/updateArnIDB';
import updateUserInfoIDB from '../../../indexedDB/updateUserInfoIDB';
import * as actions from '../../../Actions/actions';
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
  regionSortBy: {
    color: grayColor[0],
    marginBottom: '20px',
    display: 'inline-flex',
    fontSize: '16px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '20px',
      height: '20px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '18px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  regionRange: {
    width: '370px',
    height: '20px',
    fontSize: '16px',
  },

  regionSpec: {
    fontSize: '16px',
    color: grayColor[0],
  },
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

const mapDispatchToProps = (dispatch) => ({
  addRegion: (region) => dispatch(actions.addRegion(region)),
});

function UserProfile(props) {
  const classes = useStyles();
  const [updateProfile, displayUpdateProfile] = useState(true);
  const [origArn, displayArn] = useState('');
  const [dbName, addDbName] = useState('');
  const [dbEmail, addDbEmail] = useState('');
  const [dbRegion, addDbRegion] = useState('');
  const [updatedArn, updateArn] = useState('');
  const [updatedEmail, updateEmail] = useState('');
  const [originalEmail, updateOriginalEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [successNotification, setSuccessNotification] = useState(false);
  const [failureNotification, setFailureNotification] = useState(false);
  const [passwordFailNotification, setPasswordFailNotification] =
    useState(false);
  const arnArray = useLiveQuery(getArnArrayIDB);
  const userInfoArray = useLiveQuery(getUserInfoArrayIDB);
  const regionArray = useLiveQuery(getRegionIDB);

  useEffect(() => {
    if (arnArray && arnArray[0]) {
      displayArn(arnArray[0].arn);
    }
  }, [arnArray]);

  useEffect(() => {
    if (regionArray && regionArray[0]) {
      addDbRegion(regionArray[0].region);
      props.addRegion(regionArray[0].region);
    }
  }, [regionArray]);

  useEffect(() => {
    if (userInfoArray && userInfoArray[0]) {
      addDbName(userInfoArray[0].firstName);
      addDbEmail(userInfoArray[0].email);
    }
  }, [userInfoArray]);

  const handleUpdateRegion = () => {
    if (newRegion.trim() === '') {
      showNotification('failure');
      return;
    }

    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dbEmail,
        newRegion,
      }),
    };

    fetch('/user/updateRegion', reqParams)
      .then((res) => res.json())
      .then((response) => {
        console.log('Update region response: ', response);
        if (response) {
          showNotification('success');
          updateRegionIDB({ region: response.region });
          props.addRegion(response.region);
        } else {
          showNotification('failure');
        }
      });
  };

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
              <h5 className={classes.cardTitle}>
                <big>AWS Region: </big>
                <br />
                {regions[dbRegion]}
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
                      <h4 className={classes.cardTitleWhite}>
                        Update Your Default Region
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <GridItem xs={12} sm={12} md={6}>
                        <FormControl className={classes.regionRange}>
                          <InputLabel
                            htmlFor='region-change-select'
                            className={classes.regionSpec}
                          >
                            {' '}
                            <EditLocation /> Update Your Default Region
                          </InputLabel>
                          <br />
                          <Select
                            id='region-change-select'
                            value={newRegion}
                            className={classes.regionSpec}
                            onChange={(e) => {
                              setNewRegion(e.target.value);
                            }}
                          >
                            <MenuItem
                              value='us-east-2'
                              className={classes.regionSpec}
                            >
                              US East (Ohio) — us-east-2
                            </MenuItem>
                            <MenuItem
                              value='us-east-1'
                              className={classes.regionSpec}
                            >
                              US East (N. Virginia) — us-east-1
                            </MenuItem>
                            <MenuItem
                              value='us-west-1'
                              className={classes.regionSpec}
                            >
                              US West (N. California) — us-west-1
                            </MenuItem>
                            <MenuItem
                              value='us-west-2'
                              className={classes.regionSpec}
                            >
                              US West (Oregon) — us-west-1
                            </MenuItem>
                            <MenuItem
                              value='af-south-1'
                              className={classes.regionSpec}
                            >
                              Africa (Cape Town) — af-south-1
                            </MenuItem>
                            <MenuItem
                              value='ap-east-1'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Hong Kong) — ap-east-1
                            </MenuItem>
                            <MenuItem
                              value='ap-south-1'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Mumbai) — ap-south-1
                            </MenuItem>
                            <MenuItem
                              value='ap-northeast-3'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Osaka) — ap-northeast-3
                            </MenuItem>
                            <MenuItem
                              value='ap-northeast-2'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Seoul) — ap-northeast-2
                            </MenuItem>
                            <MenuItem
                              value='ap-southeast-1'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Singapore) — ap-southeast-1
                            </MenuItem>
                            <MenuItem
                              value='ap-southeast-2'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Sydney) — ap-southeast-2
                            </MenuItem>
                            <MenuItem
                              value='ap-northeast-1'
                              className={classes.regionSpec}
                            >
                              Asia Pacific (Tokyo) — ap-northeast-1
                            </MenuItem>
                            <MenuItem
                              value='ca-central-1'
                              className={classes.regionSpec}
                            >
                              Canada (Central) — ca-central-1
                            </MenuItem>
                            <MenuItem
                              value='eu-central-1'
                              className={classes.regionSpec}
                            >
                              Europe (Frankfurt) — eu-central-1
                            </MenuItem>
                            <MenuItem
                              value='eu-west-1'
                              className={classes.regionSpec}
                            >
                              Europe (Ireland) — eu-west-1
                            </MenuItem>
                            <MenuItem
                              value='eu-west-2'
                              className={classes.regionSpec}
                            >
                              Europe (London) — eu-west-2
                            </MenuItem>
                            <MenuItem
                              value='eu-south-1'
                              className={classes.regionSpec}
                            >
                              Europe (Milan) — eu-south-1
                            </MenuItem>
                            <MenuItem
                              value='eu-west-3'
                              className={classes.regionSpec}
                            >
                              Europe (Paris) — eu-west-3
                            </MenuItem>
                            <MenuItem
                              value='eu-north-1'
                              className={classes.regionSpec}
                            >
                              Europe (Stockholm) — eu-north-1
                            </MenuItem>
                            <MenuItem
                              value='me-south-1'
                              className={classes.regionSpec}
                            >
                              Middle East (Bahrain) — me-south-1
                            </MenuItem>
                            <MenuItem
                              value='sa-east-1'
                              className={classes.regionSpec}
                            >
                              South America (São Paulo) — sa-east-1
                            </MenuItem>
                            <MenuItem
                              value='us-gov-east-1'
                              className={classes.regionSpec}
                            >
                              AWS GovCloud (US-East) — us-gov-east-1
                            </MenuItem>
                            <MenuItem
                              value='us-gov-west-1'
                              className={classes.regionSpec}
                            >
                              AWS GovCloud (US-West) — us-gov-west-1
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </CardBody>
                    <br />
                    <CardFooter>
                      <Button color='success' onClick={handleUpdateRegion}>
                        Update Region
                      </Button>
                    </CardFooter>
                  </Card>
                </GridContainer>
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
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
