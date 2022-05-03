import {
    Alert,
    Button,
    Dialog,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Snackbar,
    TextField,
    Typography,
    Paper,
    Modal
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/system';
import React, { useEffect, useState } from 'react';
import Axios from '../../axios';
import theme from '../../themes';
import CloseIcon from '@material-ui/icons/Close';
import TripForm from './TripForm';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
// import { KeyboardDatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import Challan from './Challan';
const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: '#fff',
        // padding: '10px',
        borderRadius: '10px',
        position: 'relative'
    },
    tripSkeleton: {
        width: '100%',
        height: '50px',
        padding: '10px 20px',
        margin: '20px auto',
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
        height: '50px',
        margin: '20px auto',
        padding: '10px 20px',
        // border: '1px solid grey',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        boxShadow: ' rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;'
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
    },
    addBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    },
    btnCont: {
        // position: 'absolute',
        // top: '10px',
        // right: '20px'
    },
    tripBlock: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        margin: '5px',
        // alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '15px',
        border: `2px solid ${theme.palette.secondary.dark}`,
        backgroundColor: '#fff',
        '&:hover': {
            transform: `scale(1.03)`,
            cursor: 'pointer',
            transition: 'all 450ms ease-in-out'
        }
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
    const [showDialog, setShowDialog] = useState();
    const [updatingTrip, setUpdatingTrip] = useState();
    const [searchInput, setSearchInput] = useState();
    const d = new Date();
    const [endDate, setEndDate] = useState(new Date());
    const [tempEndDate, setTempEndDate] = useState(new Date());
    d.setMonth(d.getMonth() - 1);
    const [tempStartDate, setTempStartDate] = useState(d);
    const [startDate, setStartDate] = useState(d);
    const [showDateSelect, setShowDateSelect] = useState(true);
    const [challanDialog, setChallanDialog] = useState(false);
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
        Axios.post('/trip/get-all-trips', { startDate, endDate })
            .then((data) => {
                setTrips(data.data);
                setTripsLoading(false);
                setUpdatingTrip();
                console.log(data.data);
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                setTripsLoading(false);
            });
    };

    useEffect(() => {
        getAllTrips();
        // var d = new Date();
        // console.log(d.setMonth(d.getMonth() - 1), 'ago');
        // console.log(d);
        console.log(startDate.toLocaleString(), endDate);
    }, [startDate, endDate]);

    const handleClose = () => {
        setShowDialog(false);
        setShowDetails();
    };

    const addTrip = (data) => {
        Axios.post('/trip/create-trip', { data })
            .then((res) => {
                getAllTrips();
                setAlertMessage('Trip Added Successfully');
                setSuccessSnack(true);
                handleClose();
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                handleClose();
            });
    };

    const updateTrip = (data, id) => {
        handleClose();
        setUpdatingTrip(id);
        Axios.patch(`trip/update-trip/${id}`, { data })
            .then((response) => {
                getAllTrips();
                setAlertMessage('Trip Updated successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
            });
    };

    const handleSearch = () => {
        if (searchInput)
            Axios.get(`/trip/get-trip-by-lr/${searchInput}`)
                .then((response) => {
                    setTrips(response.data);
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        else getAllTrips();
    };

    const setDates = (days, month, number) => {
        var date = new Date();
        var today = new Date();
        if (days) {
            date.setDate(date.getDate() - number);
            setStartDate(date);
            if (number == 1) setEndDate(date);
            else setEndDate(today);
        } else if (month) {
            //for previous month last date
            var date = new Date();
            date.setDate(0);
            console.log(date);
            setEndDate(date);

            //for perivous Month First date
            var date = new Date();
            date.setDate(0);
            date.setDate(1);
            console.log(date);
            setStartDate(date);
        }
    };

    return (
        <div className={classes.root}>
            <Box sx={{ mb: 1 }}>
                <Typography textAlign={'left'} variant="h2">
                    All Trips
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }}></Divider>
            <Grid container alignItems={'center'} className={classes.GridCont}>
                <Grid xs={3}>
                    <Box>
                        <TextField label="Select Date Range" select fullWidth>
                            <MenuItem value={8} onClick={() => setDates(true, false, 0)}>
                                Today
                            </MenuItem>
                            <MenuItem value={9} onClick={() => setDates(true, false, 1)}>
                                Yesterday
                            </MenuItem>
                            <MenuItem value={10} onClick={() => setDates(true, false, 7)}>
                                Last 7 days
                            </MenuItem>
                            <MenuItem value={20} onClick={() => setDates(true, false, 30)}>
                                Last 30 days
                            </MenuItem>
                            <MenuItem value={30} onClick={() => setDates(false, true, 1)}>
                                Last month
                            </MenuItem>
                            {showDateSelect && (
                                <Box sx={{ m: 2 }} alignItems="center" justifyContent={'center'} display="flex">
                                    <TextField
                                        id="date"
                                        label="Start Date"
                                        type="date"
                                        defaultValue={startDate.toISOString().split('T')[0]}
                                        value={startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(new Date(e.target.value))}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        size="small"
                                        style={{ marginRight: ' 10px' }}
                                    />
                                    <TextField
                                        id="date"
                                        label="End Date"
                                        type="date"
                                        value={endDate.toISOString().split('T')[0]}
                                        defaultValue={endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(new Date(e.target.value))}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        size="small"
                                        style={{ marginRight: ' 10px' }}
                                    />
                                    <Button className={classes.addBtn} size="small" variant="contained" onClick={() => getAllTrips()}>
                                        Apply
                                    </Button>
                                </Box>
                            )}
                        </TextField>
                    </Box>
                </Grid>
                <Grid item xs={6} container justifyContent={'center'}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Search by LR No.</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            label="Search by LR No."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        //   onClick={handleClickShowPassword}
                                        //   onMouseDown={handleMouseDownPassword}
                                        onClick={() => handleSearch()}
                                        edge="end"
                                    >
                                        {<SearchIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
                </Grid>
                <Grid item container xs={3} justifyContent={'right'}>
                    <Box className={classes.btnCont}>
                        <Button
                            className={classes.addBtn}
                            onClick={() => setShowDialog(true)}
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            TRIP
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Divider style={{ margin: '20px auto', height: '1px', backgroundColor: 'black' }}></Divider>
            <Grid container justifyContent="center" spacing={1}>
                {trips.length ? (
                    trips.map((trip) =>
                        trip._id != updatingTrip ? (
                            <>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    className={classes.tripBlock}
                                    onClick={() => {
                                        setShowDetails(trip);
                                        setShowDialog(true);
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
                                        <Typography style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
                                            Customer: {customers.find((o) => o._id == trip.customer)?.name}
                                        </Typography>
                                        <Typography style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>
                                            {format(new Date(trip.tripDate), 'dd MMM yy')}
                                        </Typography>
                                    </Box>
                                    <Typography style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>
                                        Location: {trip.pickup} to {trip.dropup}
                                    </Typography>
                                    <Typography style={{ fontSize: '18px', fontWeight: 'bold', color: 'gray' }}>
                                        Vehicle: {vehicles.find((o) => o._id == trip.vehicle)?.name}
                                    </Typography>
                                </Grid>
                                {/* <Box
                                    className={classes.tripCont}
                                    onClick={() => {
                                        setShowDetails(trip);
                                        setShowDialog(true);
                                    }}
                                >
                                    <Grid container>
                                        <Grid item className={classes.tripItems} xs={4}>
                                            <Typography variant="h5">
                                                {trip.pickup} - to - {trip.dropup}
                                            </Typography>
                                        </Grid>
                                        <Grid item className={classes.tripItems} xs={4}>
                                            <Typography variant="h5">
                                                Vehicle - {vehicles.find((o) => o._id == trip.vehicle)?.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item className={classes.tripItems} xs={4}>
                                            <Typography variant="h5">
                                                Customer - {customers.find((o) => o._id == trip.customer)?.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box> */}
                            </>
                        ) : (
                            <Box className={classes.tripSkeleton}></Box>
                        )
                    )
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
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Typography textAlign={'center'}>No Data Available</Typography>
                    </Box>
                )}
            </Grid>
            <Dialog open={showDialog} onClose={() => handleClose()}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h3" textAlign={'center'}>
                        TRIP DETAILS
                    </Typography>
                    <CloseIcon className={[classes.closeIcon, 'closeIcon']} color="red" onClick={() => handleClose()} />
                    <Divider style={{ marginTop: '10px' }} />
                    <TripForm addTrip={addTrip} updateTrip={updateTrip} trip={showDetails} setChallanDialog={setChallanDialog} />
                </Box>
            </Dialog>
            <Snackbar open={successSnack} autoHideDuration={3000} onClose={() => setSuccessSnack(false)}>
                <Alert onClose={() => setSuccessSnack(false)} severity="success" variant="filled">
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnack} autoHideDuration={3000} onClose={() => setErrorSnack(false)}>
                <Alert onClose={() => setErrorSnack(false)} severity="error" variant="filled">
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Modal open={challanDialog} onClose={() => setChallanDialog(false)}>
                <Challan />
            </Modal>
        </div>
    );
}

export default AllTrips;
