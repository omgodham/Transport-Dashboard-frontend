import { Alert, Avatar, Box, Button, Dialog, Divider, Grid, Snackbar, TextField, Typography } from '@material-ui/core';
import React from 'react';
import * as yup from 'yup';
import Axios from '../../axios';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '500px',
        padding: '0 20px 20px'
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
    }
}));

function VehicleForm({ getAllVehicles, handleClose, setAlertMsg, setSuccessSnack, setErrorSnack }) {
    const classes = useStyles();

    const validationSchema = yup.object({
        number: yup.string('Enter vehicle number').required('Vehicles number is required'),
        name: yup.string('Please enter vehicle name.').required('Name is required'),
        model: yup.string('Please enter vehicle model.').required('Vehicle model is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            number: '',
            model: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                number: values.number,
                model: values.model
            };
            Axios.post('/vehicle/create-vehicle', { data })
                .then((response) => {
                    getAllVehicles();
                    // setOpen(false);
                    handleClose();
                    setAlertMsg('New vehicle saved successfully');
                    setSuccessSnack(true);
                })
                .catch((error) => {
                    setAlertMsg('Something went wrong');
                    setErrorSnack(true);
                });
        }
    });

    return (
        <div className={classes.root}>
            <Typography variant="h2" style={{ textAlign: 'center', margin: '20px auto' }}>
                Vehicle Details
            </Typography>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="model"
                            name="model"
                            label="Vehicle Model"
                            value={formik.values.model}
                            onChange={formik.handleChange}
                            error={formik.touched.model && Boolean(formik.errors.model)}
                            helperText={formik.touched.model && formik.errors.model}
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
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3 }} className={classes.subBtnCont}>
                    <Button color="secondary" className={classes.subBtn} variant="contained" fullWidth type="submit">
                        Submit
                    </Button>
                </Box>
            </form>
        </div>
    );
}

export default VehicleForm;
