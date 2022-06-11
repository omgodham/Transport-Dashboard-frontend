import {
    Alert,
    Backdrop,
    Button,
    CircularProgress,
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
    Typography
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/system';
import React, { useEffect, useState } from 'react';
import Axios from '../../axios';
import ChallanImages from './ChallanImages';
import TripBill from './TripBill';
import TripForm from './TripForm';
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#fff',
        padding: '10px',
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
        margin: '10px auto',
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
        top: '15px',
        right: '15px',
        cursor: 'pointer',
        borderRadius: '50%',
        border: '1px solid red',
        fontWeight: 500,
        marginRight: '8px',
        color: theme.palette.grey[100],
        borderColor: theme.palette.grey[100]
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
    },
    tripdetailHead: {
        backgroundColor: theme.palette.secondary[800]
    },
    cardHeading: {
        fontSize: '1.5rem',
        fontWeight: 500,
        marginRight: '8px',
        color: theme.palette.grey[100]
    },
    mainHeading: {
        fontSize: '2rem',
        color: theme.palette.grey[600]
    },
    editIconBox: {
        border: '1px solid #dc2f02',
        borderRadius: '5px',
        padding: '2px',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        color: '#dc2f02',
        cursor: 'pointer'
    },
    backdrop: {
        zIndex: 11111111,
        color: '#fff'
    }
}));

function AllTrips() {
    const classes = useStyles();
    const [trips, setTrips] = useState([]);
    const [tripsCopy, setTripsCopy] = useState([]);
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
    const [activeDriver, setActiveDriver] = useState();
    const [challanDialog, setChallanDialog] = useState(false);
    const [imagesOpen, setImagesOpen] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [showBill, setShowBill] = useState();
    const [activeTrip, setActiveTrip] = useState();
    const [savingTrip, setSavingTrip] = useState();

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
        Axios.post('/trip/get-all-trips', { startDate, endDate, activeDriver })
            .then((data) => {
                setTrips(data.data);
                setTripsCopy(data.data);
                setTripsLoading(false);
                setUpdatingTrip();
                return data.data;
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                setTripsLoading(false);
            });
    };

    useEffect(() => {
        getAllTrips();
    }, [startDate, endDate]);

    const handleClose = () => {
        setShowDialog(false);
        setShowDetails();
    };

    const addTrip = (data) => {
        Axios.post('/trip/create-trip', { data })
            .then((res) => {
                setSavingTrip(false);
                getAllTrips();
                setAlertMessage('Trip Added Successfully');
                setSuccessSnack(true);
                handleClose();
            })
            .catch((error) => {
                setSavingTrip(false);
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                handleClose();
            });
    };

    const updateTrip = (data, id, isClose) => {
        setShowBackdrop(true);
        setUpdatingTrip(id);
        Axios.patch(`trip/update-trip/${id}`, { data })
            .then((response) => {
                setSavingTrip(false);
                setShowDetails(response.data);
                if (isClose) handleClose();
                getAllTrips();
                setAlertMessage('Trip Updated successfully');
                setSuccessSnack(true);
                setShowBackdrop(false);
            })
            .catch((error) => {
                setSavingTrip(false);
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
                setShowBackdrop(false);
            });
    };

    const handleSearch = () => {
        if (searchInput)
            Axios.get(`/trip/get-trip-by-lr/${searchInput}`)
                .then((response) => {
                    setTrips(response.data);
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
            setEndDate(date);

            //for perivous Month First date
            var date = new Date();
            date.setDate(0);
            date.setDate(1);
            setStartDate(date);
        }
    };

    const setDriverFilter = (driver) => {};

    const setChallanFilter = (status) => {
        let tempTrips = tripsCopy;

        if (status == 'added') {
            tempTrips = tempTrips.filter(function (trip) {
                return trip.challanImages.length > 0;
            });
        } else {
            tempTrips = tempTrips.filter(function (trip) {
                return trip.challanImages.length == 0;
            });
        }

        setTrips(tempTrips);
    };

    return (
        <div className={classes.root}>
            <Box sx={{ mb: 1 }}>
                <Typography className={classes.mainHeading} textAlign={'center'} variant="h2">
                    ALL TRIPS
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }}></Divider>
            <Grid container alignItems={'center'} className={classes.GridCont}>
                <Grid xs={3} display="flex">
                    <Box sx={{ width: '250px', mr: 1 }}>
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

                    <Box sx={{ width: '150px' }}>
                        <TextField label="Challan Status" select fullWidth onChange={(e) => setChallanFilter(e.target.value)}>
                            <MenuItem value="added">Added</MenuItem>
                            <MenuItem value="notAdded">Not Added</MenuItem>
                        </TextField>
                    </Box>
                </Grid>
                {/* <Grid container item xs={3}></Grid> */}
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
                            size="medium"
                        >
                            TRIP
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Divider style={{ margin: '20px auto', height: '1px', backgroundColor: 'black' }}></Divider>
            <Grid container justifyContent="center">
                {trips.length ? (
                    trips
                        .slice(0)
                        .reverse()
                        .map((trip) =>
                            trip._id != updatingTrip && trip.driver != activeDriver ? (
                                <>
                                    {/* <Grid
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
                                </Grid> */}
                                    <Grid item xs={12} className={classes.tripCont}>
                                        <Grid container>
                                            <Grid item className={classes.tripItems} xs={3}>
                                                <Typography variant="h5">
                                                    Customer - {customers.find((o) => o._id == trip.customer)?.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item className={classes.tripItems} xs={3}>
                                                <Typography variant="h5">
                                                    {trip.pickup} - to - {trip.dropup}
                                                </Typography>
                                            </Grid>
                                            <Grid item className={classes.tripItems} xs={3}>
                                                <Typography variant="h5">
                                                    Vehicle - {vehicles.find((o) => o._id == trip.vehicle)?.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item className={classes.tripItems} xs={3}>
                                                <Box
                                                    onClick={() => {
                                                        setShowDetails(trip);
                                                        setShowDialog(true);
                                                    }}
                                                    className={classes.editIconBox}
                                                >
                                                    <CreateIcon color="black" />
                                                </Box>
                                                <Button
                                                    className={classes.submitBtn}
                                                    variant="outlined"
                                                    fullWidth
                                                    style={{ width: 'fit-content' }}
                                                    color="secondary"
                                                    onClick={() => {
                                                        setShowBill(true);
                                                        setActiveTrip(trip);
                                                    }}
                                                >
                                                    Generate Bill
                                                </Button>
                                            </Grid>
                                            {/* <Grid item className={classes.tripItems} justifyContent="right" xs={3}>
                                            <Button
                                                className={classes.submitBtn}
                                                variant="contained"
                                                fullWidth
                                                style={{ backgroundColor: 'green', width: 'fit-content' }}
                                                onClick={() => {
                                                    setShowDetails(trip);
                                                    setChallanDialog(true);
                                                }}
                                            >
                                                Generate Challan
                                            </Button>
                                        </Grid> */}
                                        </Grid>
                                    </Grid>
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
            <Dialog open={showDialog && !challanDialog && !imagesOpen}>
                <Box sx={{ p: 2, position: 'default' }} className={classes.tripdetailHead}>
                    <Typography className={classes.cardHeading} textAlign={'center'}>
                        TRIP DETAILS
                    </Typography>
                    <CloseIcon className={[classes.closeIcon, 'closeIcon']} color="red" onClick={() => handleClose()} />
                </Box>
                <Divider style={{ marginTop: '10px' }} />
                <Box sx={{ overflow: 'scroll', p: 2 }}>
                    <TripForm
                        addTrip={addTrip}
                        updateTrip={updateTrip}
                        trip={showDetails}
                        setChallanDialog={setChallanDialog}
                        setImagesOpen={setImagesOpen}
                        savingTrip={savingTrip}
                        setSavingTrip={setSavingTrip}
                    />
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
            {/* <Modal open={challanDialog} onClose={() => setChallanDialog(false)}>
                <Challan trip={showDetails} customers={customers} />
            </Modal> */}
            <Dialog open={imagesOpen} onClose={() => setImagesOpen(false)}>
                <Box sx={{ p: 2, position: 'default' }} className={classes.tripdetailHead}>
                    <Typography className={classes.cardHeading} textAlign={'center'}>
                        Challans
                    </Typography>
                    <CloseIcon className={[classes.closeIcon, 'closeIcon']} color="red" onClick={() => setImagesOpen(false)} />
                </Box>
                <Box>
                    <ChallanImages
                        updateTrip={updateTrip}
                        trip={showDetails}
                        challanImages={showDetails?.challanImages}
                        setImagesOpen={setImagesOpen}
                        setShowBackdrop={setShowBackdrop}
                    />
                </Box>
            </Dialog>

            <Dialog open={showBill}>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ p: 2 }}>
                        <CloseIcon
                            className={[classes.closeIcon, 'closeIcon']}
                            style={{ color: 'black', borderColor: 'black' }}
                            onClick={() => setShowBill(false)}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <TripBill trip={activeTrip} />
                    </Box>
                </Box>
            </Dialog>

            <Backdrop className={classes.backdrop} open={showBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default AllTrips;
