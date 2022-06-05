import {
    Box,
    Button,
    Divider,
    Grid,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../axios';
import logo from '../../images/logo.png';
import { ToWords } from 'to-words';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles((theme) => ({
    root: {
        // border: '1px solid black',
        margin: '20px',
        minWidth: '500px'
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
    signBox: {
        border: '1px solid black',
        width: '100px',
        height: '40px',
        marginBottom: '10px'
    }
}));

function TripBill({ trip, setAlertMessage, setErrorSnack }) {
    const classes = useStyles();
    const componentRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const toWords = new ToWords();

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

    return (
        <Box>
            <Box ref={componentRef} sx={{ m: 3 }} className={classes.root}>
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
                                    {trip.company ? (
                                        trip.company == 'swapnil' ? (
                                            'SWAPNIL TRANSPORT'
                                        ) : (
                                            trip.company == 'atlas' && 'ATLAS CARGO'
                                        )
                                    ) : (
                                        <Skeleton height={60} />
                                    )}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    {trip.company ? 'SR.NO.300 ADARSH NAGAR DIGHI, PUNE' : <Skeleton />}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    {trip.company ? 'GST - 27AEXPH6465H1ZU' : <Skeleton />}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    {trip.company ? 'MOB.NO.9850774981,9922431249' : <Skeleton />}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2, height: '2px', backgroundColor: 'black' }}></Divider>
                    <Box display={'flex'} justifyContent="space-between">
                        <Box>
                            <Typography variant="h5">Bill No - </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5">Date : {new Date().toLocaleDateString()}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" fontSize={'18px'}>
                            TO M/S -{' '}
                            {customers.length ? customers.map((customer) => customer._id == trip.customer && customer.name) : <Skeleton />}
                        </Typography>
                        <Typography>
                            {customers.length ? (
                                customers.map((customer) => customer._id == trip.customer && customer.address.addressLine1)
                            ) : (
                                <Skeleton />
                            )}
                        </Typography>
                    </Box>
                </Grid>
                <Divider sx={{ my: 2, height: '2px' }}></Divider>
                <Box>
                    <TableContainer component={Box} className={classes.tableContainer}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell className={classes.tripItem}>Trip Date</TableCell>
                                    <TableCell className={classes.tripItem} component="th" scope="row" align="center">
                                        {new Date(trip.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Freight
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.totalPayment}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Vehicle No.
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {vehicles.map((vehicle) => vehicle._id == trip.vehicle && vehicle.number)}
                                    </TableCell>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Extra Charges
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.extraCharges ? trip.extraCharges : '-'}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Challan
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.challanNo}
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="left">
                                        Advance
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {' '}
                                        {trip.paymentReceived}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        From
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.pickup}
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="left">
                                        Net Balance
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.totalPayment - trip.paymentReceived}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        To
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.dropup}
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center"></TableCell>
                                    <TableCell className={classes.tripItem} align="center"></TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Amount
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.totalPayment}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Extra Charges
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        {trip.extraCharges ? trip.extraCharges : '-'}
                                    </TableCell>
                                </TableRow> */}
                            </TableHead>
                            <TableBody className={classes.tableBody} display="flex" alignItems="right" justifyContent="right">
                                <TableRow className={classes.tableRow} key={trip._id}></TableRow>
                                <TableRow style={{ border: 'none' }}>
                                    <TableCell className={classes.tripItem} colSpan={2}></TableCell>
                                    <TableCell className={classes.tripItem}>Net Balance</TableCell>
                                    <TableCell className={classes.tripItem} align="right">
                                        {trip.totalPayment - trip.paymentReceived}
                                    </TableCell>
                                </TableRow>
                                {/* <TableRow style={{ border: 'none' }}>
                                    <TableCell className={classes.tripItem} colSpan={2}></TableCell>
                                    <TableCell align="right" sx={{ p: 0.5 }} alignItems="right" textAlign="right">
                                        {toWords.convert(trip.totalPayment - trip.paymentReceived, { currency: true })}
                                    </TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box display={'flex'} alignItems="right" width={'fit-content'} sx={{ ml: 'auto', mt: 5 }}>
                    <Grid container spacing={5} display={'flex'}>
                        <Grid item alignItems="center">
                            <Box className={classes.signBox}></Box>
                            <Typography textAlign={'center'}>TRANSPORT</Typography>
                        </Grid>
                        <Grid item alignItems="center">
                            <Box className={classes.signBox}></Box>
                            <Typography textAlign={'center'}>RECEIVED</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box sx={{ mt: 5 }} display={'flex'} alignItems="center" justifyContent={'center'}>
                <ReactToPrint
                    trigger={() => (
                        <Button startIcon={<PrintIcon />} className={classes.btn} variant="contained">
                            PRINT
                        </Button>
                    )}
                    content={() => componentRef.current}
                />
            </Box>
        </Box>
    );
}

export default TripBill;
