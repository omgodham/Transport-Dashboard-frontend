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
    CircularProgress,
    Skeleton,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from '../../axios';
import FileBase64 from 'react-file-base64';
import Compressor from 'compressorjs';
import moment from 'moment';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import storage from '../../firebase';
import async from 'async';
import { getTrip } from './helpers';
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

function TripForm({
    trip,
    updateTrip,
    addTrip,
    setChallanDialog,
    setImagesOpen,
    savingTrip,
    setSavingTrip,
    addingTrip,
    setAddingTrip,
    selfTrip,
    setSelfTrip,
    setAlertMessage,
    setErrorSnack
}) {
    const classes = useStyles();
    // const [alertMessage, setAlertMessage] = useState();
    // const [errorSnack, setErrorSnack] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [extraCharges, setExtraCharges] = useState([]);
    const [showDetails, setShowDetails] = useState();
    const [showDialog, setShowDialog] = useState(1);
    const [customExtraChargeCheck, setCustomExtraChargeCheck] = useState(false);
    const [customerProgress, setCustomerProgress] = useState(0);
    const [driverProgress, setDrivererProgress] = useState(0);
    const [vehicleProgress, setVehicleProgress] = useState(0);
    const [chargeProgress, setChargeProgress] = useState(0);
    const [companies, setCompanies] = useState([]);
    const [companyProgress, setCompanyProgress] = useState(0);
    const [isCustomVehicle, setIsCustomVehicle] = useState();
    const [tempSelectedImages, setTempSelectedImages] = useState([]);
    const [previousChallanImages, setPreviousChallanImages] = useState([]);

    useEffect(() => {
        if (selfTrip) {
            Axios.get('/customer/get-all-customers', {
                onDownloadProgress: (progressEvent) => {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setCustomerProgress(percentCompleted);
                }
            })
                .then((res) => {
                    setCustomers(res.data);
                })
                .catch((error) => {
                    setAlertMessage('Could not get customers');
                    setErrorSnack(true);
                });

            Axios.get('/vehicle/get-all-vehicles', {
                onDownloadProgress: (progressEvent) => {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setVehicleProgress(percentCompleted);
                }
            })
                .then((res) => {
                    setVehicles(res.data);
                })
                .catch((error) => {
                    setAlertMessage('Could not get vehicles');
                    setErrorSnack(true);
                });

            Axios.get('/driver/get-all-drivers', {
                onDownloadProgress: (progressEvent) => {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setDrivererProgress(percentCompleted);
                }
            })
                .then((res) => {
                    setDrivers(res.data);
                })
                .catch((error) => {
                    setAlertMessage('Could not get drivers');
                    setErrorSnack(true);
                });
        }

        Axios.get('/extracharge/get-all-extra-charges', {
            onDownloadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setChargeProgress(percentCompleted);
            }
        })
            .then((res) => {
                setExtraCharges(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get extra charges');
                setErrorSnack(true);
            });

        Axios.get('/company/get-all-companies', {
            onDownloadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setCompanyProgress(percentCompleted);
            }
        })
            .then((response) => {
                setCompanies(response.data);
            })
            .catch((error) => console.log(error));

        const fetchTrip = async () => {
            try {
                let tempTrip = await getTrip(trip._id);
                setPreviousChallanImages(tempTrip.challanImages);
            } catch (error) {
                setAlertMessage(error.message);
                setErrorSnack(true);
            }
        };
        if (trip) return fetchTrip();
    }, [trip, selfTrip]);

    useEffect(() => {
        if (trip) {
            if (!extraCharges.some((item) => item.amount == trip.extraCharge)) setCustomExtraChargeCheck(true);
            else setCustomExtraChargeCheck(false);
            setSelfTrip(trip.selfTrip);
        }
    }, [trip, extraCharges]);

    const validationSchema = yup.object({
        customer: yup.string('Select customer'),
        company: yup.string('Select Company'),
        vehicle: yup.string('Select Vehicle'),
        driver: yup.string('Select Driver'),
        dropup: yup.string('Select DropUp Locaiton'),
        pickup: yup.string('Select Pickup Location'),
        // tripDate: yup.string('Select Date').required('Date is required'),
        // materialWeight: yup.string('Enter load in KG'),
        fuelCharge: yup.string('Enter disel charge'),
        // driverExtraCharge: yup.string("Enter Driver's extra charges").required('Driver extra charge is required'),
        // agent: yup.string('Enter agent name').required('Agent name is required'),
        // challanNo: yup.string('Enter challan number').required('Challan number is required'),
        truckModel: yup.string('Enter truck model')
    });

    const formik = useFormik({
        initialValues: {
            customer: trip && trip.customer,
            customerName: trip ? trip.customerName : '',
            company: trip ? trip.company : '',
            vehicle: trip && trip.vehicle,
            vehicleNo: trip ? trip.vehicleNo : '',
            pickup: trip ? trip.pickup : '',
            dropup: trip ? trip.dropup : '',
            driver: trip && trip.driver,
            lrNo: trip ? trip.lrNo : '',
            challanNo: trip ? trip.challanNo : '',
            advanceForCustomer: trip ? trip.advanceForCustomer : '',
            advanceToDriver: trip ? trip.advanceToDriver : '',
            fuelCharge: trip ? trip.fuelCharge : 0,
            extraCharge: trip ? trip.extraCharge : 0,
            paymentReceived: trip ? trip.paymentReceived : 0,
            paymentToTransporter: trip ? trip.paymentToTransporter : 0,
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
            extraChargeDescription: trip ? trip.extraChargeDescription : '',
            billNo: trip ? trip.billNo : '',
            selfTrip: trip ? trip.selfTrip : selfTrip,
            driverName: trip ? trip.driverName : '',
            lrCharges: trip ? trip.lrCharges : 100,
            pickupCompany: trip ? trip.pickupCompany : ''
        },

        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setSavingTrip(true);
            let tempValues = values;
            let tempChallanImages = previousChallanImages ? previousChallanImages : [];
            if (tempSelectedImages.length) {
                async.series([
                    function (callback) {
                        //uploading challan images to the firebase storage
                        for (const value of tempSelectedImages) {
                            const fileName = new Date().getTime() + value.name;
                            const storageRef = ref(storage, `/challanImages/${tempValues.tripDate}/${fileName}`);
                            const uploadTask = uploadBytesResumable(storageRef, value);
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const uploaded = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                    // setProgress(uploaded);
                                },
                                (error) => {
                                    setAlertMessage(error.message);
                                    setErrorSnack(true);
                                    return '';
                                },
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                                        tempChallanImages.push(url);
                                    });
                                }
                            );
                        }

                        setTimeout(() => {
                            callback(null, 1);
                        }, 7000);
                    },
                    function (callback) {
                        tempValues.challanImages = tempChallanImages;
                        tempValues.tripDate = new Date(values.tripDate);
                        let tempExtraCharge = extraCharges.find((item) => item.amount == tempValues.extraCharge);
                        if (tempExtraCharge && !customExtraChargeCheck) {
                            tempValues.extraChargeDescription = tempExtraCharge.type;
                        }
                        if (trip) updateTrip(tempValues, trip._id, false);
                        else {
                            setAddingTrip(true);
                            addTrip(tempValues);
                        }
                        callback(null, 2);
                    }
                ]);
            } else {
                tempValues.tripDate = new Date(values.tripDate);
                let tempExtraCharge = extraCharges.find((item) => item.amount == tempValues.extraCharge);
                if (tempExtraCharge && !customExtraChargeCheck) {
                    tempValues.extraChargeDescription = tempExtraCharge.type;
                }
                if (trip) updateTrip(tempValues, trip._id, false);
                else {
                    setAddingTrip(true);
                    addTrip(tempValues);
                }
            }
        }
    });

    const handleImageCompressionAndConversion = (files) => {
        let reader = new FileReader();
        let temp = formik.values.challanImages ? [...formik.values.challanImages] : [];
        for (const file of files) {
            new Compressor(file, {
                quality: 0.5,
                success(result) {
                    reader.readAsDataURL(result);
                    temp.push(result);
                }
            });
        }
        setTempSelectedImages(temp);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {selfTrip ? (
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
                            ) : customerProgress == 100 ? (
                                <MenuItem value="none">Customers not available</MenuItem>
                            ) : (
                                <>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                </>
                            )}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            id="customerName"
                            name="customerName"
                            label="Customer Name"
                            value={formik.values.customerName}
                            onChange={formik.handleChange}
                            error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                            helperText={formik.touched.customerName && formik.errors.customerName}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
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
                        {companies.length ? (
                            companies.map((company) => {
                                return <MenuItem value={company._id}>{company.name}</MenuItem>;
                            })
                        ) : companyProgress == 100 ? (
                            <MenuItem value="none">Company not available</MenuItem>
                        ) : (
                            <>
                                <MenuItem value="none">
                                    <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                </MenuItem>
                                <MenuItem value="none">
                                    <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                </MenuItem>
                            </>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="tripDate"
                        // label={`Date of trip ${moment(new Date(formik.values.tripDate)).format('DD-MM-YYYY')}`}
                        label={`Date of trip ${formik.values.tripDate}`}
                        name="tripDate"
                        type="date"
                        fullWidth
                        defaultValue={formik.values.tripDate}
                        // defaultValue={moment(new Date(formik.values.tripDate)).format('DD-MM-YYYY')}
                        value={formik.values.tripDate}
                        // value={moment(new Date(formik.values.tripDate)).format('DD-MM-YYYY')}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        required={!trip}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
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

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isCustomVehicle}
                                onChange={(e) => setIsCustomVehicle(e.target.checked)}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Custom Vehicle"
                    />
                    {selfTrip && !isCustomVehicle ? (
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
                                    return <MenuItem value={vehicle._id}>{vehicle.number}</MenuItem>;
                                })
                            ) : vehicleProgress == 100 ? (
                                <MenuItem value="none">Vehicles not available</MenuItem>
                            ) : (
                                <>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                </>
                            )}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            id="vehicleNo"
                            name="vehicleNo"
                            label="Vehicle Number"
                            value={formik.values.vehicleNo}
                            onChange={formik.handleChange}
                            error={formik.touched.vehicleNo && Boolean(formik.errors.vehicleNo)}
                            helperText={formik.touched.vehicleNo && formik.errors.vehicleNo}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        id="pickupCompany"
                        name="pickupCompany"
                        label="Pickup Company "
                        value={formik.values.pickupCompany}
                        onChange={formik.handleChange}
                        error={formik.touched.pickupCompany && Boolean(formik.errors.pickupCompany)}
                        helperText={formik.touched.pickupCompany && formik.errors.pickupCompany}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
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

                <Grid item xs={12} md={6}>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="customExtraChargeCheck"
                                checked={customExtraChargeCheck}
                                onChange={(e) => {
                                    setCustomExtraChargeCheck(e.target.checked);
                                }}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Custom Extra Charges"
                    />
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
                    <Grid item xs={12} md={6}>
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
                            ) : chargeProgress == 100 ? (
                                <MenuItem value={0}>Charges not available</MenuItem>
                            ) : (
                                <>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                </>
                            )}
                        </TextField>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
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
                {trip && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="billNo"
                            name="billNo"
                            label="Bill Number"
                            value={formik.values.billNo}
                            onChange={formik.handleChange}
                            error={formik.touched.billNo && Boolean(formik.errors.billNo)}
                            helperText={formik.touched.billNo && formik.errors.billNo}
                        />
                    </Grid>
                )}
                {/* <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                {!selfTrip && (
                    <Grid item xs={12} md={6}>
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
                )}
                {!selfTrip && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="paymentToTransporter"
                            name="paymentToTransporter"
                            label="Payment to Transporter"
                            value={formik.values.paymentToTransporter}
                            onChange={formik.handleChange}
                            error={formik.touched.paymentToTransporter && Boolean(formik.errors.paymentToTransporter)}
                            helperText={formik.touched.paymentToTransporter && formik.errors.paymentToTransporter}
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    {selfTrip ? (
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
                            ) : driverProgress == 100 ? (
                                <MenuItem value="none">Drivers not available</MenuItem>
                            ) : (
                                <>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                    <MenuItem value="none">
                                        <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                    </MenuItem>
                                </>
                            )}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            id="driverName"
                            name="driverName"
                            label="Driver Name"
                            value={formik.values.driverName}
                            onChange={formik.handleChange}
                            error={formik.touched.driverName && Boolean(formik.errors.driverName)}
                            helperText={formik.touched.driverName && formik.errors.driverName}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        id="lrCharges"
                        name="lrCharges"
                        label="LR Charges"
                        value={formik.values.lrCharges}
                        onChange={formik.handleChange}
                        error={formik.touched.lrCharges && Boolean(formik.errors.lrCharges)}
                        helperText={formik.touched.lrCharges && formik.errors.lrCharges}
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
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
                {/* {trip?.challanImages.length ? ( */}
                {trip && (
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box display={'flex'} width="100%">
                            <Button onClick={() => setImagesOpen(true)} color="secondary" fullWidth variant="outlined">
                                View Challan
                            </Button>
                        </Box>
                    </Grid>
                )}
                {/* ) : (
                    ''
                )} */}
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
