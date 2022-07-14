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
import CloseIcon from '@material-ui/icons/Close';
import PrintIcon from '@material-ui/icons/Print';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ToWords } from 'to-words';
import Axios from '../../axios';
import logo from '../../images/logo.png';
import noData from '../../images/noData.png';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '10px',
        margin: '20px',
        minWidth: '400px',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    trip: {
        padding: '5px',
        border: '1px solid black'
    },
    tripItem: {
        padding: '7px',
        border: '1px solid black'
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

function CustomerBill({ setAlertMessage, setErrorSnack, setShowBill, bill }) {
    const classes = useStyles();
    const componentRef = useRef();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [totalEarning, setTotalEarning] = useState();
    const [totalEarningWithComma, setTotalEarningWithComma] = useState();
    // const company = trips[0]?.company;
    const toWords = new ToWords();
    const [companies, setCompanies] = useState([]);
    const [trips, setTrips] = useState([]);
    const [tripProgress, setTripsProgress] = useState(0);

    useEffect(() => {
        if (trips?.length) {
            let tempEarning = 0;
            trips.map((trip) => {
                tempEarning += (trip.totalPayment ? trip.totalPayment : 0) + (trip.extraCharge ? trip.extraCharge : 0) + trip.lrCharges;
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
        if (trips?.length) {
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
        }
    }, [trips]);

    useEffect(() => {
        Axios.post(
            '/trip/get-trips-by-ids',
            { trips: bill.trips },
            {
                onDownloadProgress: (progressEvent) => {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setTripsProgress(percentCompleted);
                }
            }
        ).then((response) => {
            console.log(response);
            setTrips(response.data);
        });
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <CloseIcon className={[classes.closeIcon, 'closeIcon']} onClick={() => setShowBill(false)} />
                {trips.length ? (
                    <div>
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
                                                    {trips.length && companies.length ? (
                                                        companies.map((company) => company._id == trips[0].company && company.address)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography fontSize={'10px'} textAlign={'left'}>
                                                    GST No. -{' '}
                                                    {trips.length && companies.length ? (
                                                        companies.map((company) => company._id == trips[0].company && company.gstNo)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography fontSize={'10px'} textAlign={'left'}>
                                                    Phone No. -{' '}
                                                    {trips.length && companies.length ? (
                                                        companies.map((company) => company._id == trips[0].company && company.phoneNo)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 2, height: '2px', backgroundColor: 'black' }}></Divider>

                                    <Box display={'flex'} justifyContent="space-between">
                                        <Grid container>
                                            <Grid item xs={7}>
                                                <Typography sx={{ mb: 1 }} variant="h6">
                                                    Bill No. - {bill.billNo}
                                                </Typography>
                                                <Typography variant="h6">
                                                    Bill To - M/S{'  '}
                                                    {trips.length && customers.length ? (
                                                        customers.map((customer) => customer._id == trips[0].customer && customer.name)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" fontSize={10}>
                                                    {trips.length && customers.length ? (
                                                        customers.map(
                                                            (customer) => customer._id == trips[0].customer && customer.address.addressLine1
                                                        )
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" fontSize={10}>
                                                    GST No. -{' '}
                                                    {trips.length && customers.length ? (
                                                        customers.map((customer) => customer._id == trips[0].customer && customer.gstNo)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography textAlign={'right'} variant="h5">
                                                    Date : {moment(new Date(bill.createdAt)).format('DD-MM-YYYY')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
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
                                                    <TableCell className={classes.tripItem}>Bill No.</TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        Vehicle No.
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        V. Model
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        LR No.
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        Challan
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        From
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        To
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        Amount
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        LR Charges
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        Extra Charges
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody
                                                className={classes.tableBody}
                                                display="flex"
                                                alignItems="right"
                                                justifyContent="right"
                                            >
                                                {trips
                                                    .sort(function compare(a, b) {
                                                        var dateA = new Date(a.tripDate);
                                                        var dateB = new Date(b.tripDate);
                                                        return dateA - dateB;
                                                    })
                                                    .map((trip, index) => (
                                                        <TableRow className={classes.tableRow} key={trip._id}>
                                                            <TableCell className={classes.tripItem}>{index + 1}</TableCell>
                                                            <TableCell className={classes.tripItem} component="th" scope="row">
                                                                <Typography variant="body2">
                                                                    {moment(new Date(trip.tripDate)).format('DD-MM-YYYY')}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} component="th" scope="row">
                                                                <Typography variant="body2">{trip.billNo}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">
                                                                    {' '}
                                                                    {trip.vehicle
                                                                        ? vehicles.map(
                                                                              (vehicle) => vehicle._id == trip.vehicle && vehicle.number
                                                                          )
                                                                        : trip.vehicleNo}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">
                                                                    {vehicles.map(
                                                                        (vehicle) => vehicle._id == trip.vehicle && vehicle.model
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">{trip.lrNo}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} style={{ maxWidth: '' }} align="right">
                                                                <Typography variant="body2">{trip.challanNo}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">{trip.pickup}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">{trip.dropup}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">Rs. {trip.totalPayment}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body2">RS. {trip.lrCharges}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="center">
                                                                <Typography variant="body2">
                                                                    {trip.extraCharge
                                                                        ? `${trip.extraChargeDescription} - Rs.${trip.extraCharge}`
                                                                        : '-'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Box sx={{ mt: 4 }}>
                                    <Box width="fit-content">
                                        <Grid container>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6">Total Trips -</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6" style={{ fontSize: '14px' }}>
                                                        {trips.length}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box width="fit-content">
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
                                                            <Typography variant="h6">Rs. {totalEarningWithComma}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box width="fit-content">
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
                                                        {totalEarning && toWords.convert(totalEarning, { currency: true })}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                </Box>
                                <Box
                                    display={'flex'}
                                    alignItems="right"
                                    justifyContent={'space-between'}
                                    sx={{ ml: 'auto', mt: 12, mx: 7 }}
                                >
                                    <Box item alignItems="left">
                                        <Typography textAlign={'center'}>RECEIVED</Typography>
                                    </Box>
                                    <Box item alignItems="left">
                                        <Typography textAlign={'center'}>
                                            {trips.length && companies.length ? (
                                                companies.map((company) => company._id == trips[0].company && company.name)
                                            ) : (
                                                <Skeleton />
                                            )}
                                        </Typography>
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
                ) : tripProgress == 100 ? (
                    <Box sx={{ m: 'auto' }}>
                        <img src={noData} width={'200px'} style={{ opacity: '0.5' }} />
                        <Typography style={{ marginTop: '10px', textAlign: 'center' }}> No Data to Display</Typography>
                    </Box>
                ) : (
                    <Box>Loading...</Box>
                )}
            </div>
        </div>
    );
}

export default CustomerBill;
