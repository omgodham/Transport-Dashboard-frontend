import {
    Alert,
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
    CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from '../../axios';
import FileBase64 from 'react-file-base64';
import Compressor from 'compressorjs';
import moment from 'moment';

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
    },
    wrapperLoading: {
        width: '100%',
        position: 'relative'
    },
    buttonProgress: {
        color: theme.palette.secondary[800],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
}));

function TripForm({ trip, updateTrip, addTrip, setChallanDialog, setImagesOpen, savingTrip, setSavingTrip }) {
    const classes = useStyles();
    const [alertMessage, setAlertMessage] = useState();
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [extraCharges, setExtraCharges] = useState([]);
    const [showDetails, setShowDetails] = useState();
    const [showDialog, setShowDialog] = useState(1);
    const [customExtraChargeCheck, setCustomExtraChargeCheck] = useState(false);
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

        Axios.get('/extracharge/get-all-extra-charges')
            .then((res) => {
                setExtraCharges(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get extra charges');
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

    useEffect(() => {
        if (trip) {
            if (!extraCharges.some((item) => item.amount == trip.extraCharge)) setCustomExtraChargeCheck(true);
            else setCustomExtraChargeCheck(false);
        }
    }, [trip, extraCharges]);

    const validationSchema = yup.object({
        customer: yup.string('Select customer').required('Customer is required'),
        company: yup.string('Select Company').required('Company is required'),
        vehicle: yup.string('Select Vehicle').required('vehicle is required'),
        driver: yup.string('Select Driver').required('Driver is required'),
        dropup: yup.string('Select DropUp Locaiton').required('Dropup location is required'),
        pickup: yup.string('Select Pickup Location').required('Pickup location is required'),
        // tripDate: yup.string('Select Date').required('Date is required'),
        materialWeight: yup.string('Enter load in KG').required('Load is required'),
        fuelCharge: yup.string('Enter disel charge').required('Disel charge is required'),
        // driverExtraCharge: yup.string("Enter Driver's extra charges").required('Driver extra charge is required'),
        // agent: yup.string('Enter agent name').required('Agent name is required'),
        // challanNo: yup.string('Enter challan number').required('Challan number is required'),
        truckModel: yup.string('Enter truck model')
    });

    const formik = useFormik({
        initialValues: {
            customer: trip ? trip.customer : '',
            company: trip ? trip.company : '',
            vehicle: trip ? trip.vehicle : '',
            pickup: trip ? trip.pickup : '',
            dropup: trip ? trip.dropup : '',
            driver: trip ? trip.driver : '',
            lrNo: trip ? trip.lrNo : '',
            challanNo: trip ? trip.challanNo : '',
            advanceForCustomer: trip ? trip.advanceForCustomer : '',
            advanceToDriver: trip ? trip.advanceToDriver : '',
            fuelCharge: trip ? trip.fuelCharge : 0,
            extraCharge: trip ? trip.extraCharge : 0,
            paymentReceived: trip ? trip.paymentReceived : 0,
            paymentPending: trip ? trip.paymentPending : 0,
            paymentVoucherNumber: trip ? trip.paymentVoucherNumber : 0,
            materialWeight: trip ? trip.materialWeight : 0,
            truckModel: trip ? trip.truckModel : '',
            tripDate: trip ? moment(new Date(trip.tripDate)).format('DD-MM-YYYY') : moment(new Date()).format('DD-MM-YYYY'),
            totalPayment: trip ? trip.totalPayment : 0,
            agent: trip ? trip.agent : '',
            commission: trip ? trip.commission : 0,
            driverExtraCharge: trip ? trip.driverExtraCharge : 0,
            challanImages: trip ? trip.challanImages : [],
            driverBhatta: trip ? trip.Bhatta : 0,
            extraChargeDescription: trip ? trip.extraChargeDescription : ''
        },

        validationSchema: validationSchema,
        onSubmit: (values) => {
            setSavingTrip(true);
            let tempValues = values;
            let tempExtraCharge = extraCharges.find((item) => item.amount == tempValues.extraCharge);
            if (tempExtraCharge && !customExtraChargeCheck) {
                tempValues.extraChargeDescription = tempExtraCharge.type;
            }
            if (trip) updateTrip(tempValues, trip._id, false);
            else addTrip(tempValues);
        }
    });
    // setCustomExtraChargeCheck(true);

    const handleImageCompressionAndConversion = (files) => {
        let reader = new FileReader();
        let temp = [...formik.values.challanImages];
        for (const file of files) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    reader.readAsDataURL(result);
                    reader.onload = function () {
                        temp.push(reader.result);
                    };
                }
            });
        }
        formik.setFieldValue('challanImages', temp);
    };

    return (
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
                                return <MenuItem value={customer._id}>{customer.name}</MenuItem>;
                            })
                        ) : (
                            <MenuItem value="none">None</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="company"
                        name="company"
                        label="Select Company"
                        labelId="demo-simple-select-filled-label"
                        select
                        value={formik.values.company}
                        onChange={formik.handleChange}
                        error={formik.touched.company && Boolean(formik.errors.company)}
                        helperText={formik.touched.company && formik.errors.company}
                    >
                        <MenuItem value="swapnil">Swapnil Transport</MenuItem>
                        <MenuItem value="atlas">Atlas Cargo</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="tripDate"
                        label="Date of trip (DD-MM-YYYY)"
                        name="tripDate"
                        type="date"
                        fullWidth
                        // defaultValue="00-00-0000"
                        value={formik.values.tripDate}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        required={!trip}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="lrNo"
                        name="lrNo"
                        label="Lr Number"
                        value={formik.values.lrNo}
                        onChange={formik.handleChange}
                        error={formik.touched.lrNo && Boolean(formik.errors.lrNo)}
                        helperText={formik.touched.lrNo && formik.errors.lrNo}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="paymentVoucherNumber"
                        name="paymentVoucherNumber"
                        label="Payment Voucher Number"
                        value={formik.values.paymentVoucherNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.paymentVoucherNumber && Boolean(formik.errors.paymentVoucherNumber)}
                        helperText={formik.touched.paymentVoucherNumber && formik.errors.paymentVoucherNumber}
                    />
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
                                return <MenuItem value={vehicle._id}>{vehicle.name}</MenuItem>;
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
                        id="advanceToDriver"
                        name="advanceToDriver"
                        label="Advance to driver"
                        value={formik.values.advanceToDriver}
                        onChange={formik.handleChange}
                        error={formik.touched.advanceToDriver && Boolean(formik.errors.advanceToDriver)}
                        helperText={formik.touched.advanceToDriver && formik.errors.advanceToDriver}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="fuelCharge"
                        name="fuelCharge"
                        label="Disel Charge"
                        value={formik.values.fuelCharge}
                        onChange={formik.handleChange}
                        error={formik.touched.fuelCharge && Boolean(formik.errors.fuelCharge)}
                        helperText={formik.touched.fuelCharge && formik.errors.fuelCharge}
                    />
                </Grid>

                <Grid item xs={12}>
                    {' '}
                    <input
                        type="checkbox"
                        id="customExtraChargeCheck"
                        checked={customExtraChargeCheck}
                        onChange={(e) => {
                            setCustomExtraChargeCheck(e.target.checked);
                        }}
                    />
                    <label for="customExtraChargeCheck">Custom extra charges</label>
                    {customExtraChargeCheck && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="extraCharge"
                                name="extraCharge"
                                label="Enter extra charge"
                                value={formik.values.extraCharge}
                                onChange={formik.handleChange}
                                error={formik.touched.extraCharge && Boolean(formik.errors.extraCharge)}
                                helperText={formik.touched.extraCharge && formik.errors.extraCharge}
                                style={{ marginTop: '20px' }}
                                type="number"
                            />
                            <TextField
                                fullWidth
                                id="extraChargeDescription"
                                name="extraChargeDescription"
                                label="Enter extra charge description"
                                value={formik.values.extraChargeDescription}
                                onChange={formik.handleChange}
                                error={formik.touched.extraCharge && Boolean(formik.errors.extraCharge)}
                                helperText={formik.touched.extraCharge && formik.errors.extraCharge}
                                style={{ marginTop: '20px' }}
                            />
                        </Grid>
                    )}
                </Grid>
                {!customExtraChargeCheck && (
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="extraCharge"
                            name="extraCharge"
                            label="Select extra charge"
                            labelId="demo-simple-select-filled-label"
                            select
                            value={formik.values.extraCharge}
                            onChange={formik.handleChange}
                            error={formik.touched.extraCharge && Boolean(formik.errors.extraCharge)}
                            helperText={formik.touched.extraCharge && formik.errors.extraCharge}
                        >
                            {extraCharges.length ? (
                                extraCharges.map((extraCharge) => {
                                    return (
                                        <MenuItem value={extraCharge.amount}>
                                            {extraCharge.type}( ₹{extraCharge.amount})
                                        </MenuItem>
                                    );
                                })
                            ) : (
                                <MenuItem value="none">None</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="challanNo"
                        name="challanNo"
                        label="Challan Number"
                        value={formik.values.challanNo}
                        onChange={formik.handleChange}
                        error={formik.touched.challanNo && Boolean(formik.errors.challanNo)}
                        helperText={formik.touched.challanNo && formik.errors.challanNo}
                    />
                </Grid>

                {/* <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="advanceForCompany"
                        name="advanceForCompany"
                        label="Advance for company"
                        value={formik.values.advanceForCompany}
                        onChange={formik.handleChange}
                        error={formik.touched.advanceForCompany && Boolean(formik.errors.advanceForCompany)}
                        helperText={formik.touched.advanceForCompany && formik.errors.advanceForCompany}
                    />
                </Grid> */}
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="totalPayment"
                        name="totalPayment"
                        label="Total Payment"
                        value={formik.values.totalPayment}
                        onChange={formik.handleChange}
                        error={formik.touched.totalPayment && Boolean(formik.errors.totalPayment)}
                        helperText={formik.touched.totalPayment && formik.errors.totalPayment}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="paymentReceived"
                        name="paymentReceived"
                        label="Payment Received"
                        value={formik.values.paymentReceived}
                        onChange={formik.handleChange}
                        error={formik.touched.paymentReceived && Boolean(formik.errors.paymentReceived)}
                        helperText={formik.touched.paymentReceived && formik.errors.paymentReceived}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="paymentPending"
                        name="paymentPending"
                        label="Payment Pending"
                        value={formik.values.paymentPending}
                        onChange={formik.handleChange}
                        error={formik.touched.paymentPending && Boolean(formik.errors.paymentPending)}
                        helperText={formik.touched.paymentPending && formik.errors.paymentPending}
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
                                return <MenuItem value={driver._id}>{driver.name}</MenuItem>;
                            })
                        ) : (
                            <MenuItem value="none">None</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="materialWeight"
                        name="materialWeight"
                        label="Material weight"
                        value={formik.values.materialWeight}
                        onChange={formik.handleChange}
                        error={formik.touched.materialWeight && Boolean(formik.errors.materialWeight)}
                        helperText={formik.touched.materialWeight && formik.errors.materialWeight}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="truckModel"
                        name="truckModel"
                        label="Truck Model"
                        value={formik.values.truckModel}
                        onChange={formik.handleChange}
                        error={formik.touched.truckModel && Boolean(formik.errors.truckModel)}
                        helperText={formik.touched.truckModel && formik.errors.truckModel}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="agent"
                        name="agent"
                        label="Agent Name"
                        value={formik.values.agent}
                        onChange={formik.handleChange}
                        error={formik.touched.agent && Boolean(formik.errors.agent)}
                        helperText={formik.touched.agent && formik.errors.agent}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="commission"
                        name="commission"
                        label="Agent Commission"
                        value={formik.values.commission}
                        onChange={formik.handleChange}
                        error={formik.touched.commission && Boolean(formik.errors.commission)}
                        helperText={formik.touched.commission && formik.errors.commission}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="driverExtraCharge"
                        name="driverExtraCharge"
                        label="Driver Extra Charge"
                        value={formik.values.driverExtraCharge}
                        onChange={formik.handleChange}
                        error={formik.touched.driverExtraCharge && Boolean(formik.errors.driverExtraCharge)}
                        helperText={formik.touched.driverExtraCharge && formik.errors.driverExtraCharge}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="driverBhatta"
                        name="driverBhatta"
                        label="Driver's Bhatta"
                        value={formik.values.driverBhatta}
                        onChange={formik.handleChange}
                        error={formik.touched.driverBhatta && Boolean(formik.errors.driverBhatta)}
                        helperText={formik.touched.driverBhatta && formik.errors.driverBhatta}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Box>
                        <label for="challanImages">Upload challan images</label>
                        <TextField
                            accept="image/*"
                            type="file"
                            id="challanImages"
                            name="challanImages"
                            inputProps={{ multiple: true }}
                            onChange={(e) => {
                                handleImageCompressionAndConversion(e.target.files);
                            }}
                            // error={formik.touched.driverExtraCharge && Boolean(formik.errors.driverExtraCharge)}
                            // helperText={formik.touched.driverExtraCharge && formik.errors.driverExtraCharge}
                        />
                    </Box>
                </Grid>
                {trip && (
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box display={'flex'} width="100%">
                            <Button onClick={() => setImagesOpen(true)} color="secondary" fullWidth variant="outlined">
                                View Challan
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
            <Box className={classes.wrapperLoading} style={{ marginTop: '20px' }}>
                <Button className={classes.submitBtn} disabled={savingTrip} variant="contained" fullWidth type="submit">
                    {trip ? 'Update' : 'Save'}
                </Button>
                {savingTrip && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Box>
            {/* {trip && (
                <Button
                    className={classes.submitBtn}
                    variant="contained"
                    fullWidth
                    style={{ marginTop: '20px', backgroundColor: 'green' }}
                    onClick={() => setChallanDialog(true)}
                >
                    Generate Challan
                </Button>
            )} */}
        </form>
    );
}

export default TripForm;
