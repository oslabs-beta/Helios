import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// core components
import styles from '../../assets/jss/material-dashboard-react/components/logTableStyle.js';

const useStyles = makeStyles(styles);

export default function LogTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, status } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + 'TableHeader']}>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.streamCell}>Log Stream</TableCell>
              <TableCell className={classes.dateCell}>Date</TableCell>
              <TableCell className={classes.msgCell}>Message</TableCell>
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            if (
              prop[2].slice(0, 13).toLowerCase().trim() === 'invoke error' &&
              status !== 'errors'
            ) {
              return (
                <TableRow key={key} className={classes.errorTableBodyRow}>
                  {prop.map((prop, key) => {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            } else {
              return (
                <TableRow key={key} className={classes.tableBodyRow}>
                  {prop.map((prop, key) => {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </div>
  );
}

LogTable.defaultProps = {
  tableHeaderColor: 'gray',
};

LogTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
