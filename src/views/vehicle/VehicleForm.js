import { Alert, Avatar, Box, Button, Dialog, Grid, Snackbar, TextField, Typography } from '@material-ui/core';
import React from 'react';
import * as yup from 'yup';
import Axios from '../../axios';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({}));

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
        <div className={classes.formCont}>
            <Typography variant="h2" style={{ textAlign: 'center', margin: '20px auto' }}>
                Vehicle Details
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

export default VehicleForm;
