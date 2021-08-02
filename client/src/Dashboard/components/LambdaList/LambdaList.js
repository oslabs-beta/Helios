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
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
// core components
import styles from '../../assets/jss/material-dashboard-react/components/tasksStyle.js';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import { Spinner } from '../../variables/spinner';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const useStyles = makeStyles(styles);

export default function LambdaList(props) {
  const classes = useStyles();

  // checked holds the current Lambda Functions checked
  const [checked, setChecked] = useState([...props.logsShown]);

  // When a fetch is in progress, creates a loading icon
  const { promiseInProgress } = usePromiseTracker();

  // when a Lambda Function is clicked
  const handleToggle = (funcName) => {
    const currentIndex = checked.indexOf(funcName);
    const newChecked = [...checked];
    // if function isn't already clicked, add it and fetch the logs from AWS
    if (currentIndex === -1) {
      newChecked.push(funcName);
      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: funcName,
          credentials: props.credentials,
          region: props.region,
          timePeriod: props.timePeriod,
        }),
      };

      // track this promise and unti it's fulfilled, trackPromise shows a loading icon
      trackPromise(fetch('/aws/getLogs', reqParams))
        .then((res) => res.json())
        .then((logs) => {
          // if we get logs back add to state
          if (logs && !logs.err) {
            props.addFunctionLogs(logs);
          }
        });
      // if the function already existed on the checked array, then we want to remove it to signal the uncheck
    } else {
      newChecked.splice(currentIndex, 1);
      props.removeFunctionLogs(funcName);
    }
    // update the checked array with new contents
    setChecked(newChecked);
  };
  const { rtlActive } = props;
  const tableCellClasses = classnames(classes.tableCell, {
    [classes.tableCellRTL]: rtlActive,
  });
  return (
    <div>
      {/* Loading icon that shows when a promise is in progress */}
      {promiseInProgress || props.updatePromise ? (
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

      {/* Table of the list of Lambda Functions associated with user's account */}
      <Table className={classes.table}>
        <TableBody>
          {props.functions.map((funcName, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell className={tableCellClasses}>
                <Checkbox
                  checked={checked.indexOf(funcName) !== -1}
                  tabIndex={-1}
                  onClick={() => handleToggle(funcName)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.root,
                  }}
                />
              </TableCell>
              <TableCell className={tableCellClasses}>{funcName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
