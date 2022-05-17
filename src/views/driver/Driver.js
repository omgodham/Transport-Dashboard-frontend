import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    InputAdornment,
    Popover,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import DeleteIcon from '@material-ui/icons/Delete';
import DriverForm from './DriverForm';
import CreateIcon from '@material-ui/icons/Create';
import DriverTrips from './DriverTrips';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        backgroundColor: '#fff',
        padding: '20px 10px'
    },
    customerSkeleton: {
        width: '100%',
        height: '50px',
        marginTop: '20px',
        borderRadius: '5px',
        backgroundColor: theme.palette.grey[300],
        animation: `$myEffect 1000ms ease infinite alternate`
    },
    '@keyframes myEffect': {
        to: {
            opacity: 0.5
        }
    },
    btnCont: {
        position: 'absolute',
        top: '20px',
        right: '10px'
    },
    formCont: {
        padding: '20px '
    },
    subBtnCont: {
        display: 'flex',
        margin: '20px auto',
        width: '300px'
    },
    subBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    },
    customerCont: {
        padding: '10px 20px',
        margin: '20px auto',
        border: '1px solid grey',
        borderRadius: '10px'
    },
    customerItems: {
        display: 'flex',
        alignItems: 'center'
        // padding: '10px'
        // justifyContent: 'center'
    },
    icons: {
        width: '24px',
        color: 'red',
        marginLeft: 'auto',
        cursor: 'pointer',
        color: '#9d0208'
    },
    addBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    },
    iconBox: {
        borderRadius: '5px',
        padding: '2px',
        margin: 'auto 10px',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer'
    }
}));

function Driver() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeDriver, setActiveDriver] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const d = new Date();
    const [endDate, setEndDate] = useState(new Date());
    d.setMonth(d.getMonth() - 1);
    const [startDate, setStartDate] = useState(d);
    const [showTrips, setShowTrips] = useState();
    const [trips, setTrips] = useState([]);

    const getAllDrivers = () => {
        Axios.get('/driver/get-all-drivers')
            .then((response) => setVehicles(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllDrivers();
    }, []);

    const handleClose = () => {
        setOpen(false);
        setActiveDriver();
    };

    const handleDelete = (id) => {
        Axios.delete(`driver/delete-driver/${id}`)
            .then((response) => {
                getAllDrivers();
                setAlertMsg('Driver deleted successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };

    const showOrders = () => {
        console.log(activeDriver, 'active');
        Axios.post(`/trip/get-trip-by-driver/${activeDriver._id}`, { startDate, endDate })
            .then((response) => {
                setTrips(response.data);
                setShowTrips(true);
            })
            .catch((error) => console.log(error));
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const popOver = Boolean(anchorEl);
    const id = popOver ? 'simple-popover' : undefined;

    return (
        <div className={classes.root}>
            <Box>
                <Typography variant="h2">DRIVERS</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.addBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        DRIVER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {vehicles?.length ? (
                        vehicles.map((driver) => {
                            console.log(driver);
                            return (
                                <Box className={classes.customerCont}>
                                    <Grid container>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h3">{driver.name}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h6">Driver NO. - {driver.phoneNo}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Box sx={{ pr: 2, ml: 'auto' }} display="flex" alignItems={'center'}>
                                                <Box
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setActiveDriver(driver);
                                                    }}
                                                    className={classes.iconBox}
                                                    border="1px solid orange"
                                                >
                                                    <CreateIcon color="orange" />
                                                </Box>
                                                <Box className={classes.iconBox} border="1px solid red">
                                                    <DeleteIcon className={classes.icons} onClick={() => handleDelete(driver._id)} />
                                                </Box>
                                                <Button
                                                    aria-describedby={id}
                                                    variant="outlined"
                                                    color="secondary"
                                                    className={classes.outlinedBtn}
                                                    onClick={(e) => {
                                                        handleClick(e);
                                                        setActiveDriver(driver);
                                                    }}
                                                >
                                                    Trips
                                                </Button>
                                                <Popover
                                                    id={id}
                                                    open={popOver}
                                                    anchorEl={anchorEl}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center'
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center'
                                                    }}
                                                    onClose={() => {
                                                        setAnchorEl();
                                                    }}
                                                >
                                                    <Box display={'flex'} flexDirection="column" sx={{ p: 2 }}>
                                                        <Typography
                                                            variant="h6"
                                                            fontSize={'20px'}
                                                            marginBottom={'15px'}
                                                            className={classes.typography}
                                                            textAlign="center"
                                                        >
                                                            Select Date Range
                                                        </Typography>
                                                        <Divider backgroundColor="black" />
                                                        <Box sx={{ mb: 1.5 }}>
                                                            <TextField
                                                                type={'date'}
                                                                label="Select Intial Date"
                                                                value={startDate.toISOString().split('T')[0]}
                                                                defaultValue={startDate.toISOString().split('T')[0]}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                onChange={(e) => {
                                                                    setStartDate(e.target.value);
                                                                }}
                                                                size="small"
                                                                sx={{ mr: 1 }}
                                                            />
                                                            <TextField
                                                                type={'date'}
                                                                label="Select End Date"
                                                                value={endDate.toISOString().split('T')[0]}
                                                                defaultValue={endDate.toISOString().split('T')[0]}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                onChange={(e) => {
                                                                    setEndDate(e.target.value);
                                                                }}
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <Button
                                                            onClick={() => showOrders()}
                                                            margin="auto"
                                                            size="small"
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            SHOW ORDERS
                                                        </Button>
                                                    </Box>
                                                </Popover>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            );
                        })
                    ) : (
                        <>
                            <Box className={classes.customerSkeleton}></Box>
                            <Box className={classes.customerSkeleton}></Box>
                            <Box className={classes.customerSkeleton}></Box>
                            <Box className={classes.customerSkeleton}></Box>
                            <Box className={classes.customerSkeleton}></Box>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={open} onClose={() => handleClose()}>
                <DriverForm
                    getAllDrivers={getAllDrivers}
                    setOpen={setOpen}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    setAlertMsg={setAlertMsg}
                    handleClose={handleClose}
                    activeDriver={activeDriver}
                />
            </Dialog>

            <Dialog maxWidth="lg" open={showTrips}>
                <DriverTrips trips={trips} setAlertMsg={setAlertMsg} setShowTrips={setShowTrips} setErrorSnack={setErrorSnack} />
            </Dialog>

            <Snackbar open={successSnack} autoHideDuration={4000} onClose={() => setSuccessSnack(false)}>
                <Alert onClose={() => setAlertMsg('')} severity="success" variant="filled">
                    {alertMsg}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnack} autoHideDuration={4000} onClose={() => setErrorSnack(false)}>
                <Alert onClose={() => setAlertMsg('')} severity="error" variant="filled">
                    {alertMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Driver;
