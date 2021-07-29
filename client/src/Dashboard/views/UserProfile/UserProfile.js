import React from 'react';
// @material-ui/core components
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
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
};

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  userInfo: state.main,
});

const handleUpdateArn = () => {
  const reqParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: props.userInfo.email, newArn: updatedArn }),
  };
  displayUpdateProfile(false);
};

function UserProfile(props) {
  const [updateProfile, displayUpdateProfile] = useState(false);
  const [updatedArn, updateArn] = useState(props.userInfo.arn);
  const classes = useStyles();

  const handleUpdateArn = () => {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: props.userInfo.email, newArn: updatedArn }),
    };
    fetch('/user/updateArn', reqParams)
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
      })
      .catch((err) =>
        console.log('Error in updating arn on User Profile: ', err)
      );
    displayUpdateProfile(false);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <img src={logo} alt='...' />
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                <big>Your Name: </big>
                <br />
                {props.userInfo.firstName}
              </h4>
              <h5 className={classes.cardTitle}>
                <big>Your Email: </big>
                <br />
                {props.userInfo.email}
              </h5>
              <h5 className={classes.cardTitle}>
                <big>AWS Helios Delegation Role: </big>
                <br />
                {props.userInfo.arn}
              </h5>
              <Button
                color='info'
                onClick={() => {
                  displayUpdateProfile(true);
                }}
              >
                Update Profile
              </Button>
            </CardBody>
          </Card>
        </GridItem>
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
                        <CustomInput
                          labelText='Old Email'
                          id='old-email'
                          autoComplete='email'
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText='New Email'
                          id='new-email'
                          autoComplete='email'
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </CardBody>
                    <CardFooter>
                      <Button
                        color='success'
                        onClick={() => {
                          displayUpdateProfile(false);
                        }}
                      >
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
                        <CustomInput
                          labelText='New ARN'
                          id='new-arn'
                          formControlProps={{
                            fullWidth: true,
                          }}
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
                        <CustomInput
                          labelText='Old Password'
                          type='password'
                          id='old-password'
                          autoComplete='password'
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText='New Password'
                          id='new-password'
                          type='password'
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText='Confirm New Password'
                          id='confirm-new-password'
                          type='password'
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </CardBody>
                    <CardFooter>
                      <Button
                        color='success'
                        onClick={() => {
                          displayUpdateProfile(false);
                        }}
                      >
                        Change Password
                      </Button>
                    </CardFooter>
                  </Card>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color='danger'
                  onClick={() => {
                    displayUpdateProfile(false);
                  }}
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        )}
      </GridContainer>
    </div>
  );
}
export default connect(mapStateToProps, null)(UserProfile);
