import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  primaryColor,
  blackColor,
  hexToRgb,
} from '../../assets/jss/material-dashboard-react';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// @material-ui/icons
import CallSplit from '@material-ui/icons/CallSplit';
import Check from '@material-ui/icons/Check';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

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

  // checked holds the API names checked
  const [checked, setChecked] = useState([...props.apiMetricsShown]);

  // if the API is opened, it shows the paths (e.g. /signin)
  const [apiOpened, setApiOpen] = useState([]);

  // if the path is opened, it shows the methods (e.g. GET or POST)
  const [resourceOpened, setResourceOpen] = useState([]);

  // tracks if a fetch is in progress
  const { promiseInProgress } = usePromiseTracker();

  // handles when the API is checked to update the array and fetch the metrics to be shown
  const handleCheck = (name) => {
    const currIndex = checked.indexOf(name);
    const newChecked = [...checked];

    // if not already checked, fetch
    if (currIndex === -1) {
      newChecked.push(name);
      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: props.credentials,
          timePeriod: props.timePeriod,
          api: name,
          region: props.region,
        }),
      };
      // track the promise to show a loading icon until it's resolved
      trackPromise(fetch('/aws/getApiMetrics', reqParams))
        .then((res) => res.json())
        .then((metricData) => {
          // add metrics to state
          props.addApiMetrics(metricData);
        });
    } else {
      // if it's already checked remove from array and state
      newChecked.splice(currIndex, 1);
      props.removeApiMetrics(name);
    }
    // update the new checked array
    setChecked(newChecked);
  };

  // handle when the API is expanded to then show the paths/resources that exist in it
  const handleApiClick = (name) => {
    const currIndex = apiOpened.indexOf(name);
    const newApiOpened = [...apiOpened];
    // if it's not already expanded, add it to the array
    if (currIndex === -1) {
      newApiOpened.push(name);
    } else {
      // if it's already expanded, remove it to collapse
      newApiOpened.splice(currIndex, 1);
    }
    // update the array
    setApiOpen(newApiOpened);
  };

  // handle when a path/resource is expanded to show the methods that exist on it (e.g. GET or POST)
  const handleResourceClick = (path) => {
    const currResourceInd = resourceOpened.indexOf(path);
    const newResourceOpened = [...resourceOpened];
    // if it doesn't exist on the array already, add it
    if (currResourceInd === -1) {
      newResourceOpened.push(path);
    } else {
      // if it's already expanded, remove it from the array
      newResourceOpened.splice(currResourceInd, 1);
    }
    // update the array
    setResourceOpen(newResourceOpened);
  };

  return (
    <div>
      {/* The loading icon that only shows when a promise is in progress */}
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

      {/* List of APIs */}
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        className={classes.root}
      >
        {/* Map user's existing APIs so they're separated out */}
        {props.apiList.map((api, key) => (
          <>
            {/* The name of the API plus the checkbox icon to show if it's been checked or not */}
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

              {/* The expand more icon to drop down more info about specific API */}
              {apiOpened.indexOf(api.name) === -1 ? (
                <ExpandMore onClick={() => handleApiClick(api.name)} />
              ) : (
                <ExpandLess onClick={() => handleApiClick(api.name)} />
              )}
            </ListItem>

            {/* Below only shows if the API has been expanded aka existing on the apiOpened array */}
            <Collapse
              in={apiOpened.indexOf(api.name) !== -1}
              timeout='auto'
              unmountOnExit
            >
              {/* Nested list to show resources/paths existing on the API */}
              <List component='div' disablePadding key={'api' + key}>
                {api.resources.map((resource, resourceKey) => (
                  <>
                    {/* Map through the resources and give an expand option if methods exist on the API */}
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
                        {/* Nested list to show methods that exist on path/resource */}
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
