import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import updateArnIDB from '../indexedDB/updateArnIDB';
import updateRegionIDB from '../indexedDB/updateRegionIDB';
import OpenInNew from '@material-ui/icons/OpenInNew';
import EditLocation from '@material-ui/icons/EditLocation';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as actions from '../Actions/actions';
import Select from '@material-ui/core/Select';
import logo from '../Dashboard/assets/img/helios-blue-logo-t.png';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import getUserInfoArrayIDB from '../indexedDB/getUserInfo';
import { grayColor } from '../Dashboard/assets/jss/material-dashboard-react';

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
  openIcon: { height: '15px' },
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
  awsLink: {
    color: 'inherit',
  },
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
    width: '410px',
    height: '20px',
    fontSize: '16px',
  },

  regionSpec: {
    width: '410px',
    fontSize: '16px',
    color: grayColor[0],
  },
}));

const mapStateToProps = (state) => ({
  userEmail: state.main.email,
  main: state.main,
});

const mapDispatchToProps = (dispatch) => ({
  addAwsAccount: (userInfo) => dispatch(actions.addAwsAccount(userInfo)),
  updateEmail: (email) => dispatch(actions.updateEmail(email)),
});

function Register(props) {
  const classes = useStyles();
  const history = useHistory();
  const [regionSelect, setRegion] = useState('us-east-2');
  const [arn, setArn] = useState('');

  let email = props.userEmail;

  // if user accidentally refreshes while on this page, grab email from indexedDB so they can still proceed
  useEffect(async () => {
    if (!props.arn) {
      const userInfoArray = await getUserInfoArrayIDB();
      props.updateEmail(userInfoArray[0].email);
      email = userInfoArray[0].email;
    }
  }, [props.userEmail]);

  // after register has been clicked update database
  const handleRegisterBtn = () => {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, arn, regionSelect }),
    };

    // after updating backend, also update IndexedDB
    fetch('/user/register', reqParams)
      .then((data) => {
        props.addAwsAccount({ arn, region: regionSelect });
        updateArnIDB({ arn }).catch((error) => {
          console.error('error while updating arn', error);
        });
        updateRegionIDB({ region: regionSelect }).catch((error) => {
          console.error('error while updating region', error);
        });
        history.push('/admin');
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <img alt='Helios Logo' src={logo} className={classes.logoImg} />
        <Typography component='h1' variant='h5' className={classes.pageText}>
          Connect your AWS account
          <br />
        </Typography>
        <br />
        <Typography variant='body1' className={classes.pageText}>
          It's quick and easy to connect your AWS account to Helios! Just follow
          the below steps and we'll get you all set up!
          <ol>
            <li>
              <a
                target='_blank'
                href='https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=helios-delegation&templateURL=https://project-helios-template.s3.us-east-2.amazonaws.com/updatedCloudformationHelios.yaml'
                className={classes.awsLink}
              >
                Add Helios CloudFormation stack to AWS
                <OpenInNew className={classes.openIcon} />
              </a>
            </li>
            <li>
              Make sure you check "I acknowledge that AWS CloudFormation might
              create IAM resources."
            </li>
            <li>Click "Create"</li>
            <li>
              Wait until the stack creation completes. Then head to the
              "Outputs" tab. Copy the "ARN" value below!
            </li>
          </ol>
        </Typography>

        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='arn'
          label='ARN'
          name='arn'
          autoFocus
          onChange={(e) => {
            setArn(e.target.value);
          }}
        />
        <br />
        <div className={classes.regionSortBy}>
          <FormControl className={classes.regionRange}>
            <InputLabel
              htmlFor='region-change-select'
              className={classes.regionSpec}
            >
              {' '}
              <EditLocation /> Set Default Region (You'll be able to update this
              later.)
            </InputLabel>
            <br />
            <Select
              id='region-change-select'
              value={regionSelect}
              className={classes.regionSpec}
              onChange={(e) => {
                setRegion(e.target.value);
              }}
            >
              <MenuItem value='us-east-2' className={classes.regionSpec}>
                US East (Ohio) — us-east-2
              </MenuItem>
              <MenuItem value='us-east-1' className={classes.regionSpec}>
                US East (N. Virginia) — us-east-1
              </MenuItem>
              <MenuItem value='us-west-1' className={classes.regionSpec}>
                US West (N. California) — us-west-1
              </MenuItem>
              <MenuItem value='us-west-2' className={classes.regionSpec}>
                US West (Oregon) — us-west-1
              </MenuItem>
              <MenuItem value='af-south-1' className={classes.regionSpec}>
                Africa (Cape Town) — af-south-1
              </MenuItem>
              <MenuItem value='ap-east-1' className={classes.regionSpec}>
                Asia Pacific (Hong Kong) — ap-east-1
              </MenuItem>
              <MenuItem value='ap-south-1' className={classes.regionSpec}>
                Asia Pacific (Mumbai) — ap-south-1
              </MenuItem>
              <MenuItem value='ap-northeast-3' className={classes.regionSpec}>
                Asia Pacific (Osaka) — ap-northeast-3
              </MenuItem>
              <MenuItem value='ap-northeast-2' className={classes.regionSpec}>
                Asia Pacific (Seoul) — ap-northeast-2
              </MenuItem>
              <MenuItem value='ap-southeast-1' className={classes.regionSpec}>
                Asia Pacific (Singapore) — ap-southeast-1
              </MenuItem>
              <MenuItem value='ap-southeast-2' className={classes.regionSpec}>
                Asia Pacific (Sydney) — ap-southeast-2
              </MenuItem>
              <MenuItem value='ap-northeast-1' className={classes.regionSpec}>
                Asia Pacific (Tokyo) — ap-northeast-1
              </MenuItem>
              <MenuItem value='ca-central-1' className={classes.regionSpec}>
                Canada (Central) — ca-central-1
              </MenuItem>
              <MenuItem value='eu-central-1' className={classes.regionSpec}>
                Europe (Frankfurt) — eu-central-1
              </MenuItem>
              <MenuItem value='eu-west-1' className={classes.regionSpec}>
                Europe (Ireland) — eu-west-1
              </MenuItem>
              <MenuItem value='eu-west-2' className={classes.regionSpec}>
                Europe (London) — eu-west-2
              </MenuItem>
              <MenuItem value='eu-south-1' className={classes.regionSpec}>
                Europe (Milan) — eu-south-1
              </MenuItem>
              <MenuItem value='eu-west-3' className={classes.regionSpec}>
                Europe (Paris) — eu-west-3
              </MenuItem>
              <MenuItem value='eu-north-1' className={classes.regionSpec}>
                Europe (Stockholm) — eu-north-1
              </MenuItem>
              <MenuItem value='me-south-1' className={classes.regionSpec}>
                Middle East (Bahrain) — me-south-1
              </MenuItem>
              <MenuItem value='sa-east-1' className={classes.regionSpec}>
                South America (São Paulo) — sa-east-1
              </MenuItem>
              <MenuItem value='us-gov-east-1' className={classes.regionSpec}>
                AWS GovCloud (US-East) — us-gov-east-1
              </MenuItem>
              <MenuItem value='us-gov-west-1' className={classes.regionSpec}>
                AWS GovCloud (US-West) — us-gov-west-1
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <br />
        <Button
          type='submit'
          fullWidth
          variant='contained'
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
