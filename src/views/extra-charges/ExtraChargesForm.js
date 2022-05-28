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

function ExtraChargesForm({ activeCharge, setErrorSnack, setAlertMsg, setSuccessSnack, setOpen, handleClose, getAllExtraCharges }) {
    console.log(activeCharge);
    const classes = useStyles();
    const validationSchema = yup.object({
        type: yup.string('Please enter Charge Type.').required('Charge type is required'),
        amount: yup.string('Enter charge amount.').required('Charge amount is required'),
        description: yup.string('Enter charge description')
    });

    const formik = useFormik({
        initialValues: {
            type: activeCharge ? activeCharge.type : '',
            amount: activeCharge ? activeCharge.amount : '',
            description: activeCharge ? activeCharge.description : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                type: values.type,
                amount: values.amount,
                description: values.description
            };

            if (!activeCharge)
                Axios.post('/extracharge/create-extra-charge', { data })
                    .then((response) => {
                        getAllExtraCharges();
                        handleClose();
                        setAlertMsg('New Charge saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            else
                Axios.patch(`/extracharge/update-extra-charge/${activeCharge._id}`, { data })
                    .then((response) => {
                        getAllExtraCharges();
                        handleClose();
                        setAlertMsg('New Charge saved successfully');
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
                Charge DETAILS
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="type"
                            type="string"
                            name="type"
                            label="Charge Type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            error={formik.touched.type && Boolean(formik.errors.type)}
                            helperText={formik.touched.type && formik.errors.type}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="amount"
                            type="number"
                            name="amount"
                            label="Charge Amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Name"
                            type="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
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

export default ExtraChargesForm;
