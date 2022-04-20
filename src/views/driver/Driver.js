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

function Driver() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');

    const getAllDrivers = () => {
        Axios.get('/driver/get-all-drivers')
            .then((response) => setVehicles(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllDrivers();
    }, []);

    const validationSchema = yup.object({
        name: yup.string('Please enter driver name.').required('Name is required'),
        phoneNo: yup.string('Enter phone number').required('Phone number is required'),
        salary: yup.string("Enter driver's salary").required('Salary is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            phoneNo: '',
            salary: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                number: values.phoneNO,
                salary: values.salary
            };
            Axios.post('/driver/create-driver', { data })
                .then((response) => {
                    getAllDrivers();
                    setOpen(false);
                    setAlertMsg('New driver saved successfully');
                    setSuccessSnack(true);
                })
                .catch((error) => {
                    setAlertMsg('Something went wrong');
                    setErrorSnack(true);
                });
        }
    });

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
                                            <Typography variant="h6">Driver NO. - {driver.number}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Box sx={{ pr: 2, ml: 'auto' }}>
                                                <DeleteIcon className={classes.icons} onClick={() => handleDelete(driver._id)} />
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

            <Dialog open={open} onClose={() => setOpen(false)}>
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
