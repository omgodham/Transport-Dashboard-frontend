import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from '../../axios';
import Axios from '../../axios';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '5px'
    },
    detailsBox: {
        marginTop: '20px'
        // padding: '10px'
    },
    submitBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    }
}));

const validationSchema = yup.object({
    customer: yup.string('Enter PickUp Location').required('Pickup location is required'),
    vehicle: yup.string('Select Vehicle').required('vehicle is required'),
    driver: yup.string('Select Driver').required('Driver is required'),
    dropup: yup.string('Select DropUp Locaiton').required('Dropup location is required'),
    pickup: yup.string('Select Pickup Location').required('Pickup location is required')
});

function Trip() {
    const classes = useStyles();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [alertMessage, setAlertMessage] = useState();
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();

    useEffect(() => {
        Axios.get('/customers/get-all-customers')
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get customers');
                setErrorSnack(true);
            });

        Axios.get('/vehicles/get-all-vehicles')
            .then((res) => {
                setVehicles(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get vehicles');
                setErrorSnack(true);
            });

        Axios.get('/vehicles/get-all-drivers')
            .then((res) => {
                setDrivers(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get drivers');
                setErrorSnack(true);
            });
    }, []);

    const addTrip = (data) => {
        axios
            .post('/trip/add-new-trip', { data })
            .then((res) => {
                setAlertMessage('Trip Added Successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMessage('Something went wrong');
                setErrorSnack(true);
            });
    };

    const formik = useFormik({
        initialValues: {
            customer: '',
            vehicle: '',
            pickup: '',
            dropup: '',
            driver: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addTrip(values);
        }
    });

    return (
        <div className={classes.root}>
            <Typography variant="h2">ADD NEW TRIP</Typography>
            <Box className={classes.detailsBox}>
                <Typography variant="h4">Trip Details</Typography>
                <Box sx={{ p: 1, mt: 1 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="customer"
                                    name="customer"
                                    label="Select Customer"
                                    labelId="demo-simple-select-filled-label"
                                    select
                                    value={formik.values.customer}
                                    onChange={formik.handleChange}
                                    error={formik.touched.customer && Boolean(formik.errors.customer)}
                                    helperText={formik.touched.customer && formik.errors.customer}
                                >
                                    {customers.length ? (
                                        customers.map((customer) => {
                                            return;
                                            <MenuItem value={customer.name}>{customer.name}</MenuItem>;
                                        })
                                    ) : (
                                        <MenuItem value="none">None</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="vehicle"
                                    name="vehicle"
                                    label="Select Vehicle"
                                    labelId="demo-simple-select-filled-label"
                                    select
                                    value={formik.values.vehicle}
                                    onChange={formik.handleChange}
                                    error={formik.touched.vehicle && Boolean(formik.errors.vehicle)}
                                    helperText={formik.touched.vehicle && formik.errors.vehicle}
                                >
                                    {vehicles.length ? (
                                        vehicles.map((vehicle) => {
                                            return;
                                            <MenuItem value={vehicle.name}>{vehicle.name}</MenuItem>;
                                        })
                                    ) : (
                                        <MenuItem value="none">None</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="pickup"
                                    name="pickup"
                                    label="Pickup Location"
                                    value={formik.values.pickup}
                                    onChange={formik.handleChange}
                                    error={formik.touched.pickup && Boolean(formik.errors.pickup)}
                                    helperText={formik.touched.pickup && formik.errors.pickup}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="dropup"
                                    name="dropup"
                                    label="Dropup Location"
                                    value={formik.values.dropup}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dropup && Boolean(formik.errors.dropup)}
                                    helperText={formik.touched.dropup && formik.errors.dropup}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="driver"
                                    name="driver"
                                    label="Select Driver"
                                    select
                                    labelId="demo-simple-select-filled-label"
                                    value={formik.values.driver}
                                    onChange={formik.handleChange}
                                    error={formik.touched.driver && Boolean(formik.errors.driver)}
                                    helperText={formik.touched.driver && formik.errors.driver}
                                >
                                    {drivers.length ? (
                                        drivers.map((driver) => {
                                            return;
                                            <MenuItem value={driver.name}>{driver.name}</MenuItem>;
                                        })
                                    ) : (
                                        <MenuItem value="none">None</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button className={classes.submitBtn} variant="contained" fullWidth type="submit" style={{ marginTop: '20px' }}>
                            Submit
                        </Button>
                    </form>
                </Box>
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

export default Trip;
