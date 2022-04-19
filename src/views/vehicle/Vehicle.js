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

function Vehicle() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');

    const getAllVehicles = () => {
        Axios.get('/vehicle/get-all-vehicles')
            .then((response) => setVehicles(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllVehicles();
    }, []);

    const validationSchema = yup.object({
        number: yup.string('Enter vehicle number').required('Vehicles number is required'),
        name: yup.string('Please enter vehicle name.').required('Name is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            number: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                number: values.number
            };
            Axios.post('/vehicle/create-vehicle', { data })
                .then((response) => {
                    getAllVehicles();
                    setOpen(false);
                    setAlertMsg('New vehicle saved successfully');
                    setSuccessSnack(true);
                })
                .catch((error) => {
                    setAlertMsg('Something went wrong');
                    setErrorSnack(true);
                });
        }
    });

    const handleDelete = (id) => {
        Axios.post('vehicle/delete-vehicle', { vehicleId: id })
            .then((response) => {
                getAllVehicles();
                setAlertMsg('Vehicle deleted successfully');
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
                <Typography variant="h2">VEHICLES</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.addBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        VEHICLE
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {vehicles?.length ? (
                        vehicles.map((vehicle) => {
                            console.log(vehicle);
                            return (
                                <Box className={classes.customerCont}>
                                    <Grid container>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h3">{vehicle.name}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h6">Vehicle NO. - {vehicle.number}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Box sx={{ pr: 2, ml: 'auto' }}>
                                                <DeleteIcon className={classes.icons} onClick={() => handleDelete(vehicle._id)} />
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
                                    id="number"
                                    name="number"
                                    label="Vehicle Number"
                                    value={formik.values.number}
                                    onChange={formik.handleChange}
                                    error={formik.touched.number && Boolean(formik.errors.number)}
                                    helperText={formik.touched.number && formik.errors.number}
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

export default Vehicle;
