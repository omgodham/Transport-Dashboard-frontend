import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from '../../axios';
import PaymentDetails from './PaymentDetails';

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
        cursor: 'pointer'
    },
    addBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    }
}));

function CustomerForm({ getAllCustomers, setOpen, setAlertMsg, setSuccessSnack, setErrorSnack, activeCust, setActiveCust }) {
    const classes = useStyles();
    const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
    const validationSchema = yup.object({
        email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
        name: yup.string('Please enter customer name.').required('Company Name is required'),
        ownerName: yup.string('Please enter owner name.').required('Owner name is required'),
        gstNo: yup.string('Please enter GST number.'),
        phone: yup.string('Please enter phone number.').required('Phone number is required'),
        state: yup.string('Please enter state.').required('State is required'),
        address: yup.string('Please enter address.').required('Address is required')
    });

    const formik = useFormik({
        initialValues: {
            name: activeCust ? activeCust.name : '',
            gstNo: activeCust ? activeCust.gstNo : '',
            phone: activeCust ? activeCust.contactInfo.phoneNo : '',
            email: activeCust ? activeCust.contactInfo.email : '',
            address: activeCust ? activeCust.address.addressLine1 : '',
            state: activeCust ? activeCust.address.state : '',
            ownerName: activeCust ? activeCust.ownerName : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                ownerName: values.ownerName,
                gstNo: values.gstNo,
                contactInfo: {
                    phoneNo: values.phone,
                    email: values.email
                },
                address: {
                    addressLine1: values.address,
                    state: values.state
                }
            };

            if (!activeCust) {
                Axios.post('/customer/create-customer', { data })
                    .then((response) => {
                        getAllCustomers();
                        setOpen(false);
                        setAlertMsg('New customer saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            } else {
                Axios.patch(`/customer/update-customer/${activeCust._id}`, { data })
                    .then((response) => {
                        getAllCustomers();
                        setOpen(false);
                        setAlertMsg('New customer saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            }
        }
    });

    return (
        <div className={classes.formCont}>
            <Typography variant="h2" style={{ textAlign: 'center', margin: '20px auto' }}>
                CUTOMER DETAILS
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            type="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="ownerName"
                            name="ownerName"
                            label="Owner Name"
                            type="name"
                            value={formik.values.ownerName}
                            onChange={formik.handleChange}
                            error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                            helperText={formik.touched.ownerName && formik.errors.ownerName}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="gstNo"
                            name="gstNo"
                            label="GST Number"
                            value={formik.values.gstNo}
                            onChange={formik.handleChange}
                            error={formik.touched.gstNo && Boolean(formik.errors.gstNo)}
                            helperText={formik.touched.gstNo && formik.errors.gstNo}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="state"
                            name="state"
                            label="STATE"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            helperText={formik.touched.state && formik.errors.state}
                        />
                    </Grid>
                    {activeCust && (
                        <Grid item xs={6} className={classes.formItems}>
                            <Box className={classes.subBtnCont}>
                                <Button className={classes.subBtn} variant="contained" onClick={() => setPaymentDetailsOpen(true)}>
                                    SHOW PAYMENT DETAILS
                                </Button>
                            </Box>
                        </Grid>
                    )}
                    <Box className={classes.subBtnCont}>
                        <Button className={classes.subBtn} variant="contained" fullWidth type="submit">
                            SAVE
                        </Button>
                    </Box>
                </Grid>
            </form>
            <Dialog open={paymentDetailsOpen} onClose={() => setPaymentDetailsOpen(false)}>
                <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
                <DialogContent id="simple-dialog-content">
                    <PaymentDetails
                        activeCust={activeCust}
                        getAllCustomers={getAllCustomers}
                        setAlertMsg={setAlertMsg}
                        setSuccessSnack={setSuccessSnack}
                        setErrorSnack={setErrorSnack}
                        setActiveCust={setActiveCust}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CustomerForm;
