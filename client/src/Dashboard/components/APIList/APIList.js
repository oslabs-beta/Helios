import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  primaryColor,
  blackColor,
  hexToRgb,
} from '../../assets/jss/material-dashboard-react';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
// @material-ui/icons
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import CallSplit from '@material-ui/icons/CallSplit';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// core components
import styles from '../../assets/jss/material-dashboard-react/components/tasksStyle.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  secondNested: {
    paddingLeft: theme.spacing(10),
  },
  pathName: {
    fontWeight: 'bolder',
  },
  root: {
    padding: '13px',
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
  labelRoot: {
    marginLeft: '-14px',
  },
  checked: {
    color: primaryColor[0] + '!important',
  },
  checkedIcon: {
    width: '20px',
    height: '20px',
    border: '1px solid rgba(' + hexToRgb(blackColor) + ', .54)',
    borderRadius: '3px',
  },
  uncheckedIcon: {
    width: '0px',
    height: '0px',
    padding: '10px',
    border: '1px solid rgba(' + hexToRgb(blackColor) + ', .54)',
    borderRadius: '3px',
  },
}));

export default function APIList(props) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [apiOpened, setApiOpen] = useState([]);
  const [resourceOpened, setResourceOpen] = useState([]);
  const { promiseInProgress } = usePromiseTracker();

  const handleCheck = (name) => {
    const currIndex = checked.indexOf(name);
    const newChecked = [...checked];
    if (currIndex === -1) {
      newChecked.push(name);

      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: props.credentials,
          timePeriod: props.timePeriod,
          api: name,
        }),
      };
      trackPromise(fetch('/aws/getApiMetrics', reqParams))
        .then((res) => res.json())
        .then((metricData) => {
          console.log('API Gateway Metric Data for ', name, metricData);
          props.addApiMetrics(metricData);
        });
    } else {
      newChecked.splice(currIndex, 1);
      console.log(props.removeApiMetrics);

      props.removeApiMetrics(name);
    }
    setChecked(newChecked);
  };

  const handleApiClick = (name) => {
    const currIndex = apiOpened.indexOf(name);
    const newApiOpened = [...apiOpened];
    if (currIndex === -1) {
      newApiOpened.push(name);
    } else {
      newApiOpened.splice(currIndex, 1);
    }
    setApiOpen(newApiOpened);
  };

  const handleResourceClick = (path) => {
    const currResourceInd = resourceOpened.indexOf(path);
    const newResourceOpened = [...resourceOpened];
    if (currResourceInd === -1) {
      newResourceOpened.push(path);
    } else {
      newResourceOpened.splice(currResourceInd, 1);
    }
    setResourceOpen(newResourceOpened);
  };

  return (
    <div>
      {promiseInProgress ? (
        <center>
          <Loader
            type='TailSpin'
            color='#00BFFF'
            height={50}
            width={50}
            className={classes.loader}
          />
        </center>
      ) : null}
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        className={classes.root}
      >
        {props.apiList.map((api, key) => (
          <>
            <ListItem key={key}>
              <ListItemIcon>
                <Checkbox
                  button='true'
                  checked={checked.indexOf(api.name) !== -1}
                  tabIndex={-1}
                  onClick={() => handleCheck(api.name)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.root,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={api.name} />
              {apiOpened.indexOf(api.name) === -1 ? (
                <ExpandMore onClick={() => handleApiClick(api.name)} />
              ) : (
                <ExpandLess onClick={() => handleApiClick(api.name)} />
              )}
            </ListItem>

            <Collapse
              in={apiOpened.indexOf(api.name) !== -1}
              timeout='auto'
              unmountOnExit
            >
              <List component='div' disablePadding key={'api' + key}>
                {api.resources.map((resource, resourceKey) => (
                  <>
                    <ListItem
                      button
                      onClick={() => handleResourceClick(resource.path)}
                      className={classes.nested}
                      key={resourceKey}
                    >
                      <ListItemIcon>
                        <CallSplit />
                      </ListItemIcon>

                      <ListItemText
                        className={classes.pathName}
                        primary={resource.path}
                      />

                      {resource.methods ? (
                        resourceOpened.indexOf(resource.path) === -1 ? (
                          <ExpandMore />
                        ) : (
                          <ExpandLess />
                        )
                      ) : (
                        <></>
                      )}
                    </ListItem>

                    {resource.methods && resource.methods.length ? (
                      <Collapse
                        in={resourceOpened.indexOf(resource.path) !== -1}
                        timeout='auto'
                        unmountOnExit
                      >
                        <List
                          component='div'
                          disablePadding
                          key={'resource' + key}
                        >
                          {resource.methods.map((method, methodKey) => (
                            <ListItem
                              className={classes.secondNested}
                              key={methodKey}
                            >
                              {/* <ListItemIcon>
                              <SendIcon />
                            </ListItemIcon> */}
                              {method.endPoint ? (
                                <ListItemText
                                  primary={
                                    method.method +
                                    ' — ' +
                                    method.service +
                                    ' — ' +
                                    method.endPoint
                                  }
                                />
                              ) : (
                                <ListItemText
                                  primary={
                                    method.method + ' — ' + method.service
                                  }
                                />
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </List>
            </Collapse>
          </>
        ))}
      </List>
    </div>
  );
}

APIList.propTypes = {
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.arrayOf(PropTypes.node),
  rtlActive: PropTypes.bool,
  checkedIndexes: PropTypes.array,
};
