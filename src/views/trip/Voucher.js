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
import moment from 'moment';

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
    },
    gridBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid black',
        padding: '10px'
    },
    gridInnerBox: {
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'right',
        alignItems: 'right'
        // textAlign: 'right'
    }
}));

function Voucher({ trip, setAlertMessage, setErrorSnack, forCustomer }) {
    const classes = useStyles();
    const componentRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const toWords = new ToWords();
    const [totalPayment, setTotalPayment] = useState();
    const [companies, setCompanies] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

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

    useEffect(() => {
        if (forCustomer) setTotalPayment(trip.totalPayment + trip.lrCharges + trip.extraCharge - trip.paymentReceived);
        else setTotalPayment(trip.paymentToTransporter + trip.lrCharges + trip.extraCharge - trip.advanceToTransporter);
    }, [trip]);

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
                                <Typography variant="h4" textAlign={'left'}>
                                    {trip && companies.length ? (
                                        companies.map((company) => company._id == trip.company && company.name)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    {trip && companies.length ? (
                                        companies.map((company) => company._id == trip.company && company.address)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    GST -{' '}
                                    {trip && companies.length ? (
                                        companies.map((company) => company._id == trip.company && company.gstNo)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                                <Typography fontSize={'10px'} textAlign={'left'}>
                                    Phone -{' '}
                                    {trip && companies.length ? (
                                        companies.map((company) => company._id == trip.company && company.phoneNo)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2, height: '2px', backgroundColor: 'black' }}></Divider>
                    <Box display={'flex'} justifyContent="space-between">
                        <Box>
                            <Typography variant="h5">Voucher No - {trip.paymentVoucherNumber}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5">Date : {moment(trip.createdAt).format('DD-MM-YYYY')}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Grid container>
                            <Grid item xs={7}>
                                <Typography variant="h6" fontSize={'13px'}>
                                    Bill To
                                </Typography>
                                <Typography variant="h6" fontSize={'13px'}>
                                    M/S - {forCustomer ? trip.customerName : trip.transporterName}
                                </Typography>
                                <Typography variant="body3">
                                    {customers.length ? (
                                        customers.map((customer) => customer._id == trip.customer && customer.address.addressLine1)
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Divider sx={{ my: 2, height: '2px' }}></Divider>
                <Box>
                    <TableContainer component={Box} className={classes.tableContainer}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody className={classes.tableBody} display="flex" alignItems="right" justifyContent="right">
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        <Typography variant="body3"> Vehicle No.</Typography>
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        <Typography variant="body3">
                                            {' '}
                                            {vehicles.map((vehicle) => vehicle._id == trip.vehicle && vehicle.number)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.tripItem}>
                                        <Typography variant="body3"> Trip Date</Typography>
                                    </TableCell>
                                    <TableCell className={classes.tripItem} component="th" scope="row" align="center">
                                        <Typography variant="body3"> {moment(new Date(trip.tripDate)).format('DD-MM-YYYY')}</Typography>
                                    </TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Freight
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        Rs. {trip.totalPayment}
                                    </TableCell>
                                    <TableCell align="left" className={classes.tripItem}>
                                        Extra Charges
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        Rs. {trip.extraCharges ? trip.extraCharges : '-'}
                                    </TableCell>
                                </TableRow> */}

                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        <Typography variant="body3"> Challan</Typography>
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        <Typography variant="body3"> {trip.challanNo}</Typography>
                                    </TableCell>
                                    <TableCell align="left" className={classes.tripItem}>
                                        <Typography variant="body3"> LR Number</Typography>
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        <Typography variant="body3"> {trip.lrNo}</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left" className={classes.tripItem}>
                                        <Typography variant="body3"> From</Typography>
                                    </TableCell>

                                    <TableCell className={classes.tripItem} align="center">
                                        <Typography variant="body3"> {trip.pickup}</Typography>
                                    </TableCell>
                                    <TableCell align="left" className={classes.tripItem}>
                                        <Typography variant="body3"> To</Typography>
                                    </TableCell>
                                    <TableCell className={classes.tripItem} align="center">
                                        <Typography variant="body3"> {trip.dropup}</Typography>
                                    </TableCell>
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

                                {/* <TableRow style={{ border: 'none' }}>
                                    <TableCell className={classes.tripItem} colSpan={2}></TableCell>
                                    <TableCell align="right" sx={{ p: 0.5 }} alignItems="right" textAlign="right">
                                        
                                    </TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 3, minHeight: '200px' }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Box className={classes.gridBox}>
                                <Typography> Description</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className={classes.gridBox}>
                                <Typography> Amount</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ height: '200px' }}>
                        <Grid item xs={6}>
                            <Box className={classes.gridInnerBox} sx={{ height: '200px' }}>
                                <Box sx={{ p: 1 }}>
                                    <Grid container>
                                        <Grid item>
                                            <Typography variant="body3" textAlign={'left'}>
                                                {' '}
                                                {trip.pickupCompany}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid display="flex">
                                <Grid xs={7}>
                                    <Box className={classes.gridInnerBox} textAlign="left" sx={{ height: '200px' }}>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3"> Freight </Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3"> Advance </Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3"> {trip.extraChargeDescription} </Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3"> LR Charges </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid xs={5}>
                                    <Box className={classes.gridInnerBox} sx={{ height: '200px' }}>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3">
                                                Rs. {forCustomer ? trip.totalPayment : trip.paymentToTransporter}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3">
                                                Rs. {forCustomer ? trip.paymentReceived : trip.advanceToTransporter}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3">Rs. {trip.extraCharge}</Typography>
                                        </Box>
                                        <Box sx={{ m: 1, minHeight: '10px' }}>
                                            <Typography variant="body3">Rs. {trip.lrCharges}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 2 }} display={'flex'} alignItems="right" flexDirection={'column'}>
                    <Box width="fit-content" sx={{ ml: 'auto' }}>
                        <Grid container>
                            <Grid item>
                                <Grid container>
                                    <Grid item>
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="h6">Grand Total - </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="h6">Rs. {totalPayment}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box width="fit-content" sx={{ ml: 'auto' }}>
                        <Grid container>
                            <Grid item>
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="h6">In Words - </Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="h6">
                                        {' '}
                                        {totalPayment && toWords.convert(totalPayment, { currency: true })}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                </Box>
                <Box display={'flex'} alignItems="right" width={'fit-content'} sx={{ ml: 'auto', mt: 12, mr: 5 }}>
                    <Grid container spacing={5} display={'flex'}>
                        <Grid item alignItems="center">
                            <Typography textAlign={'center'}>
                                {trip.length && companies.length ? (
                                    companies.map((company) => company._id == trip.company && company.name)
                                ) : (
                                    <Skeleton />
                                )}
                            </Typography>
                        </Grid>
                        <Grid item alignItems="center">
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

export default Voucher;
