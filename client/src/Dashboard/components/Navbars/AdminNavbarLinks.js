import React from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Notifications from '@material-ui/icons/Notifications';
import Dashboard from '@material-ui/icons/Dashboard';
import Search from '@material-ui/icons/Search';
import EditLocation from '@material-ui/icons/EditLocation';
// core components
import CustomInput from '../../components/CustomInput/CustomInput.js';
import Button from '../../components/CustomButtons/Button.js';
import { handleLogout } from '../../../Actions/actions';
import clearIDB from '../../../indexedDB/clearIDB';
import { regions } from '../../variables/regions.js';
import styles from '../../assets/jss/material-dashboard-react/components/headerLinksStyle.js';

const useStyles = makeStyles(styles);

const mapDispatchToProps = (dispatch) => ({
  handleLogout: () => dispatch(handleLogout()),
});

const mapStateToProps = (state) => ({
  region: state.main.region,
});

function AdminNavbarLinks(props) {
  const classes = useStyles();

  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleRouteToProfile = () => {
    setOpenProfile(null);
    history.push('/admin/user');
  };

  const handleLogoutAndChange = () => {
    setOpenProfile(null);
    props.handleLogout();
    clearIDB();
    history.push('/');
  };
  const history = useHistory();
  return (
    <div>
      {/* Display current region selected and navigate to the User Profile page if clicked
      where they can update the region */}
      <Link to='/admin/user'>
        <div className={classes.searchWrapper}>
          Region: {regions[props.region]}
          <Button
            color={window.innerWidth > 959 ? 'transparent' : 'white'}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-label='edit'
            className={classes.buttonLink}
          >
            <EditLocation />
          </Button>
        </div>
      </Link>

      {/* Button to navigate back to the main dashboard page */}
      <Link to='/admin/dashboard'>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label='Dashboard'
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation='css'>
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
      </Link>

      {/* The profile button on NavBar which opens up to give the option to navigate to User Profile page and/or logout */}
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? 'profile-menu-list-grow' : null}
          aria-haspopup='true'
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation='css'>
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            ' ' +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id='profile-menu-list-grow'
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role='menu'>
                    <MenuItem
                      onClick={handleRouteToProfile}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleLogoutAndChange}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbarLinks);
