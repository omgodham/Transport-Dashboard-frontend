import { Alert, Dialog, Divider, Grid, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/system';
import React, { useEffect, useState } from 'react';
import Axios from '../../axios';
import theme from '../../themes';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '10px'
    },
    tripSkeleton: {
        width: '100%',
        height: '50px',
        marginTop: '40px',
        borderRadius: '5px',
        backgroundColor: theme.palette.grey[300],
        animation: `$myEffect 1000ms ease infinite alternate`
    },
    '@keyframes myEffect': {
        to: {
            opacity: 0.5
        }
    },
    tripCont: {
        padding: '10px 20px',
        margin: '20px auto',
        border: '1px solid grey',
        borderRadius: '10px'
    },
    tripItems: {
        display: 'flex',
        alignItems: 'center'
        // padding: '10px'
        // justifyContent: 'center'
    },
    icons: {
        width: '24px',
        color: 'red',
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    tripDetailItemCont: { padding: '10px' },
    tripDetailItem: {
        borderBottom: '1px solid gray',
        marginTop: '20px'
        // borderRadius: '10px ',
        // padding: '5px 10px'
    },
    closeIcon: {
        position: 'absolute',
        top: '10px',
        right: '20px',
        cursor: 'pointer'
    }
}));

function AllTrips() {
    const classes = useStyles();
    const [trips, setTrips] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState();
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showDetails, setShowDetails] = useState();

    useEffect(() => {
        Axios.get('/customer/get-all-customers')
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get customers');
                setErrorSnack(true);
            });

        Axios.get('/vehicle/get-all-vehicles')
            .then((res) => {
                setVehicles(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get vehicles');
                setErrorSnack(true);
            });

        Axios.get('/driver/get-all-drivers')
            .then((res) => {
                setDrivers(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get drivers');
                setErrorSnack(true);
            });
    }, []);

    const getAllTrips = () => {
        Axios.get('/trip/get-all-trips')
            .then((data) => {
                setTrips(data.data);
                setTripsLoading(false);
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                setTripsLoading(false);
            });
    };

    useEffect(() => {
        getAllTrips();
    }, []);

    console.log(trips);

    return (
        <div className={classes.root}>
            <Typography variant="h2"> ALL TRIPS</Typography>
            <Box sx={{ m: 2 }}>
                {trips.length ? (
                    trips.map((trip) => (
                        <Box className={classes.tripCont} onClick={() => setShowDetails(trip._id)}>
                            <Grid container>
                                <Grid item className={classes.tripItems} xs={4}>
                                    <Typography variant="h5">
                                        {trip.pickup} - to - {trip.dropup}
                                    </Typography>
                                </Grid>
                                <Grid item className={classes.tripItems} xs={4}>
                                    <Typography variant="h5">Vehicle - {vehicles.find((o) => o._id == trip.vehicle)?.name}</Typography>
                                </Grid>
                                <Grid item className={classes.tripItems} xs={4}>
                                    <Typography variant="h5">Customer - {customers.find((o) => o._id == trip.customer)?.name}</Typography>
                                </Grid>
                                <Dialog open={showDetails == trip._id} onClose={() => setShowDetails('')}>
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="h3" textAlign={'center'}>
                                            TRIP DETAILS
                                        </Typography>
                                        <CloseIcon className={classes.closeIcon} color="red" onClick={() => setShowDetails('')} />
                                        <Divider style={{ marginTop: '10px' }} />
                                        <Grid container spacing={2} className={classes.tripDetailItemCont}>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        From
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.pickup}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        To
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.dropup}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        Customer
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {customers.find((o) => o._id == trip.customer)?.name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        Driver
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {drivers.find((o) => o._id == trip.driver)?.name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        Total Payment
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.paymentLeft + trip.paymentReceived}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        Fuel
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.fuelCharge}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        LR Number
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.lrNo}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className={classes.tripDetailItem}>
                                                    <Typography color={'#495057'} variant="h6" fontSize={'18px'}>
                                                        Chalan Number
                                                    </Typography>
                                                    <Typography color={'gray'} variant="h6" fontSize={'18px'}>
                                                        {trip.challanNo}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Dialog>
                            </Grid>
                        </Box>
                    ))
                ) : tripsLoading ? (
                    <>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                    </>
                ) : (
                    <Box>
                        <Typography>No Data Available</Typography>
                    </Box>
                )}
            </Box>
            <Snackbar open={successSnack} autoHideDuration={4000} onClose={() => setSuccessSnack(false)}>
                <Alert onClose={() => setSuccessSnack(false)} severity="success" variant="contained">
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnack} autoHideDuration={4000} onClose={() => setErrorSnack(false)}>
                <Alert onClose={() => setErrorSnack(false)} severity="error" variant="contained">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AllTrips;
