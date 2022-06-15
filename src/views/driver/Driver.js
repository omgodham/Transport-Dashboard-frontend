import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseIcon from '@material-ui/icons/Close';

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

    iconBox: {
        borderRadius: '5px',
        padding: '2px',
        margin: 'auto 10px',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    closeBox: {
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
    backdrop: {
        zIndex: 11111111,
        color: '#fff'
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
    const [savingDriver, setSavingDriver] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [addingDriver, setAddingDriver] = useState(false);
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
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
        setActiveDriver(null);
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

    const showOrders = (startDate, endDate) => {
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

    const validationSchema = yup.object({
        startDate: yup.string('Please select Start Date').required('Start Date is required'),
        endDate: yup.string('Please select End Date').required('End Date is required')
    });

    const formik = useFormik({
        initialValues: {
            startDate: d.toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let startDate = new Date(values.startDate);
            let endDate = new Date(values.endDate);

            showOrders(startDate, endDate);
        }
    });

    return (
        <div className={classes.root}>
            <Box>
                <Typography variant="h2">DRIVERS</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.subBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        DRIVER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {vehicles?.length ? (
                        vehicles.map((driver) => {
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
                                                    <Box>
                                                        <form onSubmit={formik.handleSubmit}>
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
                                                                <Box>
                                                                    <CloseIcon className={classes.closeBox} onClick={() => setAnchorEl()} />
                                                                </Box>
                                                                <Divider />
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={6}>
                                                                        <TextField
                                                                            fullWidth
                                                                            type="date"
                                                                            id="startDate"
                                                                            name="startDate"
                                                                            label="Start Date"
                                                                            value={formik.values.startDate}
                                                                            onChange={formik.handleChange}
                                                                            error={
                                                                                formik.touched.startDate && Boolean(formik.errors.startDate)
                                                                            }
                                                                            helperText={formik.touched.startDate && formik.errors.startDate}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <TextField
                                                                            fullWidth
                                                                            type="date"
                                                                            id="endDate"
                                                                            name="endDate"
                                                                            label="End Date "
                                                                            value={formik.values.endDate}
                                                                            onChange={formik.handleChange}
                                                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                                                            helperText={formik.touched.endDate && formik.errors.endDate}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Box sx={{ mt: 2 }}>
                                                                    <Button
                                                                        margin="auto"
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        fullWidth
                                                                        type="submit"
                                                                    >
                                                                        SHOW ORDERS
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </form>
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

            <Dialog open={open}>
                <DriverForm
                    getAllDrivers={getAllDrivers}
                    setOpen={setOpen}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    setAlertMsg={setAlertMsg}
                    handleClose={handleClose}
                    activeDriver={activeDriver}
                    setActiveDriver={setActiveDriver}
                    setSavingDriver={setSavingDriver}
                    savingDriver={savingDriver}
                    setShowBackdrop={setShowBackdrop}
                    setAddingDriver={setAddingDriver}
                    addingDriver={addingDriver}
                />
            </Dialog>

            <Dialog maxWidth="lg" open={showTrips}>
                <DriverTrips trips={trips} setAlertMsg={setAlertMsg} setShowTrips={setShowTrips} setErrorSnack={setErrorSnack} />
            </Dialog>
            <Backdrop className={classes.backdrop} open={showBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
