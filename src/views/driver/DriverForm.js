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
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from '../../axios';

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

function DriverForm({ getAllDrivers, setErrorSnack, setAlertMsg, setSuccessSnack, setOpen, handleClose, activeDriver }) {
    console.log(activeDriver);
    const classes = useStyles();
    const validationSchema = yup.object({
        name: yup.string('Please enter driver name.').required('Name is required'),
        phoneNo: yup.string('Enter phone number').required('Phone number is required'),
        salary: yup.string("Enter driver's salary").required('Salary is required')
    });

    const formik = useFormik({
        initialValues: {
            name: activeDriver ? activeDriver.name : '',
            phoneNo: activeDriver ? activeDriver.phoneNo : '',
            salary: activeDriver ? activeDriver.salary : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                phoneNo: values.phoneNo,
                salary: values.salary
            };
            if (!activeDriver)
                Axios.post('/driver/create-driver', { data })
                    .then((response) => {
                        getAllDrivers();
                        handleClose();
                        setAlertMsg('New driver saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            else
                Axios.patch(`/driver/update-driver/${activeDriver._id}`, { data })
                    .then((response) => {
                        getAllDrivers();
                        handleClose();
                        setAlertMsg('New driver saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
        }
    });

    return (
        <div className={classes.formCont}>
            <Typography variant="h2" style={{ textAlign: 'center', margin: '20px auto' }}>
                DRIVER DETAILS
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
                            id="phoneNo"
                            type="number"
                            name="phoneNo"
                            label="Phone Number"
                            value={formik.values.phoneNo}
                            onChange={formik.handleChange}
                            error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                            helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="salary"
                            type="number"
                            name="salary"
                            label="Driver's Salary"
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                            error={formik.touched.salary && Boolean(formik.errors.salary)}
                            helperText={formik.touched.salary && formik.errors.salary}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                            }}
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
    );
}

export default DriverForm;
