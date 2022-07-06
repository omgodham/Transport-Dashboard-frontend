import { Box, Button, Divider, Grid, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
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

function CompanyForm({
    activeCharge,
    setErrorSnack,
    setAlertMsg,
    setSuccessSnack,
    setOpen,
    handleClose,
    getAllExtraCharges,
    setActiveCharge
}) {
    const classes = useStyles();
    const validationSchema = yup.object({
        name: yup.string('Please enter Charge Type.').required('Charge type is required'),
        address: yup.string('Enter charge amount.').required('Charge amount is required'),
        gstNo: yup.string('Enter charge description'),
        phoneNo: yup.string('Enter charge description')
    });

    const formik = useFormik({
        initialValues: {
            name: activeCharge ? activeCharge.name : '',
            address: activeCharge ? activeCharge.address : '',
            gstNo: activeCharge ? activeCharge.gstNo : '',
            phoneNo: activeCharge ? activeCharge.phoneNo : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                address: values.address,
                phoneNo: values.phoneNo,
                gstNo: values.gstNo
            };

            if (!activeCharge)
                Axios.post('/company/create-company', { data })
                    .then((response) => {
                        getAllExtraCharges();
                        handleClose();
                        setAlertMsg('New Company saved successfully');
                        setSuccessSnack(true);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            else
                Axios.patch(`/company/update-company/${activeCharge._id}`, { data })
                    .then((response) => {
                        getAllExtraCharges();
                        handleClose();
                        setAlertMsg(' Company saved successfully');
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
            <Box display={'flex'}>
                <Typography variant="h2" style={{ textAlign: 'center', margin: '0px auto' }}>
                    COMPANY DETAILS
                </Typography>
                <CloseIcon
                    onClick={() => {
                        setOpen(false);
                        setActiveCharge();
                    }}
                    style={{ cursor: 'pointer' }}
                />
            </Box>
            <Divider style={{ margin: '20px auto' }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="name"
                            type="string"
                            name="name"
                            label="Company Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="address"
                            type="string"
                            name="address"
                            label="Company Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="phoneNo"
                            name="phoneNo"
                            label="Phone Number"
                            type="phoneNo"
                            value={formik.values.phoneNo}
                            onChange={formik.handleChange}
                            error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                            helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="gstNo"
                            name="gstNo"
                            label="GST Number"
                            type="gstNo"
                            value={formik.values.gstNo}
                            onChange={formik.handleChange}
                            error={formik.touched.gstNo && Boolean(formik.errors.gstNo)}
                            helperText={formik.touched.gstNo && formik.errors.gstNo}
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

export default CompanyForm;
