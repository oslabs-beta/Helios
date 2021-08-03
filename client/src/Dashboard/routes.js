/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CallSplit from '@material-ui/icons/CallSplit';

// core components/views for Admin layout
import DashboardPage from './views/Dashboard/Dashboard.js';
import UserProfile from './views/UserProfile/UserProfile.js';

import Logs from './views/Logs/Logs';
import APIGateway from './views/APIGateway/APIGateway.js';
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'AWS Lambda Metrics',
    icon: Dashboard,
    component: DashboardPage,
    layout: '/admin',
  },
  {
    path: '/logs',
    name: 'Logs',
    icon: LibraryBooks,
    component: Logs,
    layout: '/admin',
  },
  {
    path: '/apiGateway',
    name: 'API Gateway',
    icon: CallSplit,
    component: APIGateway,
    layout: '/admin',
  },
  {
    path: '/user',
    name: 'User Profile',
    icon: Person,
    component: UserProfile,
    layout: '/admin',
  },
];

export default dashboardRoutes;
