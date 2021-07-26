import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// @material-ui/icons
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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
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
}));

export default function APIList(props) {
  const classes = useStyles();
  const [apiOpened, setApiOpen] = useState([]);
  const [resourceOpened, setResourceOpen] = useState([]);

  const handleApiClick = (name) => {
    const currIndex = apiOpened.indexOf(name);
    const newApiOpened = [...apiOpened];
    if (currIndex === -1) {
      newApiOpened.push(name);
    } else {
      newApiOpened.splice(currIndex, 1);
    }
    setApiOpen(newApiOpened);
    console.log(apiOpened);
  };

  const handleResourceClick = (path) => {};

  return (
    <List
      component='nav'
      aria-labelledby='nested-list-subheader'
      className={classes.root}
    >
      {props.apiList.map((api, key) => (
        <>
          <ListItem button onClick={() => handleApiClick(api.name)} key={key}>
            <ListItemIcon>
              <CallSplit />
            </ListItemIcon>
            <ListItemText primary={api.name} />
            {apiOpened.indexOf(api.name) === -1 ? (
              <ExpandMore />
            ) : (
              <ExpandLess />
            )}
          </ListItem>

          <Collapse
            in={apiOpened.indexOf(api.name) !== -1}
            timeout='auto'
            unmountOnExit
          >
            <List component='div' disablePadding key={'api' + key}>
              {api.resources.map((resource, resourceKey) => (
                <ListItem
                  button
                  onClick={() => handleResourceClick(resource.path)}
                  className={classes.nested}
                  key={resourceKey}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary={resource.path} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      ))}
    </List>
  );
}

APIList.propTypes = {
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.arrayOf(PropTypes.node),
  rtlActive: PropTypes.bool,
  checkedIndexes: PropTypes.array,
};
