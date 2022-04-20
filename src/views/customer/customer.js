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
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';

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

function Customer() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [customers, setCustomers] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');

    const getAllCustomers = () => {
        Axios.get('/customer/get-all-customers')
            .then((response) => setCustomers(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllCustomers();
    }, []);

    const validationSchema = yup.object({
        email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
        name: yup.string('Please enter customer name.').required('Password is required'),
        gstNo: yup.string('Please enter GST number.').required('GST number is required'),
        phone: yup.string('Please enter phone number.').required('Phone number is required'),
        state: yup.string('Please enter state.').required('State is required'),
        address: yup.string('Please enter address.').required('Address is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            gstNo: '',
            phone: '',
            email: '',
            address: '',
            state: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
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
        }
    });

    const handleDelete = (id) => {
        Axios.post('customer/delete-customer', { custId: id })
            .then((response) => {
                getAllCustomers();
                setAlertMsg('Customer deleted successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };

    return (
        <div className={classes.root}>
            <Box>
                <Typography variant="h2">CUSOTMERS</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        className={classes.addBtn}
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        CUSTOMER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {customers?.length ? (
                        customers.map((customer) => (
                            <Box className={classes.customerCont}>
                                <Grid container>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Typography variant="h3">{customer.name}</Typography>
                                    </Grid>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Typography variant="h6">Phone NO. - {customer.contactInfo?.phoneNo}</Typography>
                                    </Grid>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Box sx={{ pr: 2, ml: 'auto' }}>
                                            <DeleteIcon className={classes.icons} onClick={() => handleDelete(customer._id)} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
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

            <Dialog open={open} onClose={() => setOpen(false)}>
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
                            <Box className={classes.subBtnCont}>
                                <Button className={classes.subBtn} variant="contained" fullWidth type="submit">
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                    </form>
                </div>
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

export default Customer;
