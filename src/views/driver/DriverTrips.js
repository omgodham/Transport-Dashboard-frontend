import {
    Box,
    Button,
    Divider,
    Grid,
    Typography,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableContainer,
    TableBody,
    Paper,
    Skeleton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import Axios from '../../axios';
import logo from '../../images/logo.png';
import PrintIcon from '@material-ui/icons/Print';
import CloseIcon from '@material-ui/icons/Close';
import { ToWords } from 'to-words';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '10px',
        // border: '1px solid black',
        margin: '20px'
    },
    trip: {
        padding: '5px',
        border: '1px solid black'
        // minWidth: '600px    '
    },
    tripItem: {
        // display: 'flex',
        // width: 'fit-content',
        padding: '7px',
        border: '1px solid black'
        // flexDirection: 'column'
        // margin: '0 5px',
        // borderRight: '1px solid black'
    },
    tableContainer: {
        border: '1px solid black'
    },
    table: {},
    tableHead: {
        borderRadius: '0'
    },
    tableBody: {},
    btn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    },
    closeIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        borderRadius: '50%',
        border: '1px solid red',
        fontWeight: 500,
        marginRight: '8px',
        // color: theme.palette.grey[100],
        borderColor: 'black'
    },
    footerItems: {
        display: 'flex',
        padding: '0.6rem 0'
    }
}));

function DriverTrips({ trips, setAlertMessage, setErrorSnack, setShowTrips }) {
    const classes = useStyles();
    const componentRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [totalEarningWithComma, setTotalEarningWithComma] = useState();
    const [totalEarning, setTotalEarning] = useState();
    const toWords = new ToWords();
    const company = trips[0]?.company;
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        if (trips?.length) {
            let tempEarning = 0;
            trips.map((trip) => {
                tempEarning += trip.driverExtraCharge
                    ? trip.driverExtraCharge
                    : 0 + trip.driverBhatta
                    ? trip.driverBhatta
                    : 0 + trip.advanceToDriver
                    ? trip.advanceToDriver
                    : 0;
            });

            setTotalEarning(tempEarning);

            tempEarning = tempEarning.toString();
            var lastThree = tempEarning.substring(tempEarning.length - 3);
            var otherNumbers = tempEarning.substring(0, tempEarning.length - 3);
            if (otherNumbers != '') lastThree = ',' + lastThree;
            tempEarning = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

            setTotalEarningWithComma(tempEarning);
        }
    }, [trips]);

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
        Axios.get('/company/get-all-companies')
            .then((response) => {
                setCompanies(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <CloseIcon className={[classes.closeIcon, 'closeIcon']} onClick={() => setShowTrips(false)} />
                <div ref={componentRef}>
                    <Box sx={{ backgroundColor: '#fff', p: 2 }}>
                        <Grid sx={{ mb: 2 }}>
                            <Grid container>
                                <Grid item xs={3} display="flex" alignItems={'center'}>
                                    <Box>
                                        <img src={logo} alt="logo" width={'100px'} />
                                    </Box>
                                </Grid>
                                <Grid item xs={9} display="flex" alignItems="right" alignContent={'right'} justifyContent="right">
                                    <Box width={'fit-content'} minWidth={'200px'}>
                                        <Typography variant="h2" textAlign={'left'}>
                                            {trips.length && companies.length ? (
                                                companies.map((company) => company._id == trips[0].company && company.name)
                                            ) : (
                                                <Skeleton />
                                            )}
                                        </Typography>
                                        <Typography fontSize={'10px'} textAlign={'left'}>
                                            {company ? 'SR.NO.300 ADARSH NAGAR DIGHI, PUNE' : <Skeleton />}
                                        </Typography>
                                        <Typography fontSize={'10px'} textAlign={'left'}>
                                            {company ? 'GST - 27AEXPH6465H1ZU' : <Skeleton />}
                                        </Typography>
                                        <Typography fontSize={'10px'} textAlign={'left'}>
                                            {company ? 'MOB.NO.9850774981,9922431249' : <Skeleton />}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2, height: '2px', backgroundColor: 'black' }}></Divider>
                            <Box display={'flex'} justifyContent="space-between">
                                <Box>
                                    <Typography variant="h5">
                                        TO -{' '}
                                        {trips.length && customers.length ? (
                                            drivers.map((driver) => driver._id == trips[0].driver && driver.name)
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5">Date : {new Date().toLocaleDateString()}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Divider sx={{ my: 1, height: '10px' }}></Divider>
                        <Box>
                            <TableContainer component={Box} className={classes.tableContainer}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead className={classes.tableHead}>
                                        <TableRow>
                                            <TableCell className={classes.tripItem}>SR</TableCell>
                                            <TableCell className={classes.tripItem}>Date</TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Vehicle No.
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Vehicle Model
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Bill/Voucher
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                From
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                To
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Advance
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Bhatta
                                            </TableCell>
                                            <TableCell align="right" className={classes.tripItem}>
                                                Extra Charges
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className={classes.tableBody} display="flex" alignItems="right" justifyContent="right">
                                        {trips.map((trip, index) => (
                                            <TableRow className={classes.tableRow} key={trip._id}>
                                                <TableCell className={classes.tripItem}>{index + 1}</TableCell>
                                                <TableCell className={classes.tripItem} component="th" scope="row">
                                                    {new Date(trip.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {vehicles.map((vehicle) => vehicle._id == trip.vehicle && vehicle.number)}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {vehicles.map((vehicle) => vehicle._id == trip.vehicle && vehicle.model)}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {trip.billNo ? trip.billNo : trip.paymentVoucherNumber}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {trip.pickup}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {trip.dropup}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {trip.advanceToDriver}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="right">
                                                    {trip.driverBhatta}
                                                </TableCell>
                                                <TableCell className={classes.tripItem} align="center">
                                                    {trip.driverExtraCharge ? trip.driverExtraCharge : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display={'flex'} alignItems="left" justifyContent={'left'}>
                            <Box>
                                <Box className={classes.footerItems}>
                                    <Box sx={{ mr: 1.5 }}>
                                        <Typography variant="h5">Total Trips</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{trips?.length}</Typography>
                                    </Box>
                                </Box>
                                <Box className={classes.footerItems}>
                                    <Box sx={{ mr: 1.5 }}>
                                        <Typography variant="h5">Total</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{totalEarningWithComma}</Typography>
                                    </Box>
                                </Box>
                                <Box className={classes.footerItems}>
                                    <Box sx={{ mr: 1.5 }}>
                                        <Typography variant="h5">Total</Typography>
                                    </Box>
                                    <Box>
                                        <Typography> {totalEarning && toWords.convert(totalEarning, { currency: true })}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </div>

                <Box display={'flex'} alignItems="center" justifyContent={'center'}>
                    <ReactToPrint
                        trigger={() => (
                            <Button startIcon={<PrintIcon />} className={classes.btn} variant="contained">
                                PRINT
                            </Button>
                        )}
                        content={() => componentRef.current}
                    />
                </Box>
            </div>
        </div>
    );
}

export default DriverTrips;
