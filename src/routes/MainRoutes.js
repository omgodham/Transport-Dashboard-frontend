import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';
import AllTrips from '../views/trip/all-trips';
import customer from '../views/customer/customer';
import Customer from '../views/customer/customer';
import Vehicle from '../views/vehicle/Vehicle';
import Driver from '../views/driver/Driver';
import ExtraCharges from '../views/extra-charges/ExtraCharges';
import Company from '../views/company/Company';
import Bill from '../views/bill/Bill';
import CustomerYearlyBills from '../views/customerYearlyBills/CustomerYearlyBills';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/trip/all-trips',
                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',
                '/customers',
                '/vehicles',
                '/drivers',
                '/extra-charges',
                '/sample-page',
                '/company',
                '/bill',
                '/customer-yearly-bills'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />
                        <Route path="/trip/all-trips" component={AllTrips} />
                        <Route path="/utils/util-typography" component={UtilsTypography} />
                        <Route path="/utils/util-color" component={UtilsColor} />
                        <Route path="/utils/util-shadow" component={UtilsShadow} />
                        <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                        <Route path="/icons/material-icons" component={UtilsMaterialIcons} />
                        <Route path="/sample-page" component={SamplePage} />
                        <Route path="/customers" component={Customer} />
                        <Route path="/vehicles" component={Vehicle} />
                        <Route path="/drivers" component={Driver} />
                        <Route path="/extra-charges" component={ExtraCharges} />
                        <Route path="/company" component={Company} />
                        <Route path="/bill" component={Bill} />
                        <Route path="/customer-yearly-bills" component={CustomerYearlyBills} />
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
