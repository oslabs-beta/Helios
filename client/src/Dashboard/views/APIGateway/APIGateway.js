import React from 'react';
import { useEffect, useState } from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import { connect } from 'react-redux';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
// @material-ui/icons
import Store from '@material-ui/icons/Store';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Update from '@material-ui/icons/Update';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import Accessibility from '@material-ui/icons/Accessibility';
import BugReport from '@material-ui/icons/BugReport';
import Code from '@material-ui/icons/Code';
import Cloud from '@material-ui/icons/Cloud';
// core components
import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import LogTable from '../../components/Table/LogTable.js';
import APIList from '../../components/APIList/APIList.js';
import CustomTabs from '../../components/CustomTabs/CustomTabs.js';
import Danger from '../../components/Typography/Danger.js';
import LogCard from '../../components/Card/LogCard.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Card from '../../components/Card/Card.js';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import * as actions from '../../../Actions/actions';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import styles from '../../assets/jss/material-dashboard-react/views/apiStyle.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  aws: state.aws,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
});

function APIGateway(props) {
  const classes = useStyles();
  const [dateSelect, setDateRange] = useState('1hr');

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
    if (props.aws.functionLogs) {
      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: props.aws.functionLogs,
          newTimePeriod: e.target.value,
          credentials: props.credentials,
        }),
      };
      fetch('/aws/updateLogs', reqParams)
        .then((res) => res.json())
        .then((updatedLogs) => {
          props.updateFunctionLogs(updatedLogs);
        })
        .catch((err) => console.log('Error in refreshing updateLogs: ', err));
    }
  };

  useEffect(() => {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentials: {
          accessKeyId: 'ASIASCGOUE2KPFA52XOG',
          secretAccessKey: 'jzU+W77kpxe3+Oy0WiXjFcbmrQvES2hvZ8/pWK0x',
          sessionToken:
            'IQoJb3JpZ2luX2VjEEQaCXVzLWVhc3QtMiJIMEYCIQCFLKo9dMnJOXRpIkpPcuz8cevx9yXhVvT9+Y86UpdBUwIhAMuudPZRmA6+6TbCQSAno3MTeHAJUwvHOFOQNSzPZUgLKpoCCE0QABoMMTQyMTY3MjU0Njc2IgzZ+vxHHnVvnpwz8boq9wGfyVY7pURIGLrBFV4ta386gtfujR7/wmuzDneGQiHSqSjeI2GVjZHYy1QWc6H93AxDp0J5Qz2cJtIY/gBm/BccUdv27iNMedxzLbhZ7t5FLCikN7rU6DbI1tu4OlNmAO9SDs38sNavD9pCKpKZz+5ndbjaEKu4H1evwD2vtocCPPUj/WVS2qptwx0zfahY/qFRWscpcSKmIifFhm8nrRaEW1u9YsdWmcF7iiz7gIPordmQ05M08Edl4aI0jKynFRnOYZZ/n4ut+wlUgCrBWBdi72eUO+oIP9+GgL7Doqf5+EsB9dTeEWelFrPCE//OvO2b5H3zEsRHMKmr/IcGOpwBQduiOryUBRrfpbvRJA86/KdwxlnrbP9P62vi+VhWj30axbSgLhpQdgCGgjzOsgGTsAfefGmKpvwI8IFO4pqCAf0Gw6EkEGM4Z49LUq0fLeQrFLuldU5uHc5YENPx+d8WbXd3TkQTZ0VA7F3egT8d3zTBMYBcxz2/m5q8arL8mRqp6ClOOhdHZfBaGzLFvOwO5Njf6h2XyrJcnynS',
        },
      }),
    };
    fetch('/aws/apiGateway', reqParams)
      .then((res) => res.json())
      .then((apiData) => {
        console.log('logging from API Gateway useEffect fetch: ', apiData);
      })
      .catch((err) =>
        console.log('Error inside API Gateway useEffect fetch: ', err)
      );
  }, []);

  return (
    <div className={classes.logGrid}>
      <div className={classes.sortBy}>
        <FormControl className={classes.timeRange}>
          <InputLabel htmlFor='date-change-select' className={classes.dateSpec}>
            {' '}
            <DateRange /> Time Period
          </InputLabel>
          <br />
          <Select
            id='date-change-select'
            value={dateSelect}
            className={classes.dateSpec}
            onChange={handleDateChange}
          >
            <MenuItem value='30min' className={classes.dateSpec}>
              Last 30 Minutes
            </MenuItem>
            <MenuItem value='1hr' className={classes.dateSpec}>
              Last Hour
            </MenuItem>
            <MenuItem value='24hr' className={classes.dateSpec}>
              Last 24 Hours
            </MenuItem>
            <MenuItem value='7d' className={classes.dateSpec}>
              Last 7 Days
            </MenuItem>
            <MenuItem value='14d' className={classes.dateSpec}>
              Last 14 Days
            </MenuItem>
            <MenuItem value='30d' className={classes.dateSpec}>
              Last 30 Days
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <br />
      <GridContainer>
        <GridItem xs={4} sm={4} md={4}>
          <Card>
            <CardHeader color='danger'>
              <h4 className={classes.cardTitleWhite}>Rest APIs</h4>
            </CardHeader>
            <CardBody>
              <APIList
                apiList={[
                  {
                    name: 'Crypto',
                    apiId: '3mi5k0hgr1',
                    resources: [
                      {
                        resourceId: '2mwnpv',
                        path: '/getchart/subgetchart',
                        methods: [
                          {
                            method: 'GET',
                            type: 'AWS',
                            uri: 'arn:aws:apigateway:us-east-2:dynamodb:action/',
                          },
                        ],
                      },
                      {
                        resourceId: '3um74j',
                        path: '/refreshprofits',
                        methods: [
                          {
                            method: 'POST',
                            type: 'AWS_PROXY',
                            uri: 'arn:aws:apigateway:us-east-2:lambda:path/2015-03-3…7254676:function:CryptoRefreshProfits/invocations',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'WildRydes',
                    apiId: 'z1w95ck6jk',
                    resources: [
                      {
                        resourceId: 'ye5gbz',
                        path: '/ride',
                        methods: [
                          {
                            method: 'POST',
                            type: 'AWS_PROXY',
                            uri: 'arn:aws:apigateway:us-east-2:lambda:path/2015-03-3…142167254676:function:RequestUnicorn2/invocations',
                          },
                        ],
                      },
                    ],
                  },
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(APIGateway);
