import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Snackbar,
    TextField,
    Typography,
    MenuItem,
    CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomerForm from './CustomerForm';
import Bill from './Bill';
import CloseIcon from '@material-ui/icons/Close';

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
        // padding: '10px 20px',
        // margin: '20px auto',
        // border: '1px solid grey',
        // borderRadius: '10px'
        // height: '60px',
        margin: '10px auto',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        boxShadow: ' rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;'
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
        cursor: 'pointer',
        color: '#9d0208'
    },
    addBtn: {
        // backgroundColor: theme.palette.secondary.dark,
        // '&:hover': {
        //     backgroundColor: theme.palette.secondary[800]
        // }
    },
    closeIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        borderRadius: '50%',
        border: '1px solid red',
        fontWeight: 500,
        marginRight: '8px',
        // color: theme.palette.grey[100],
        borderColor: 'black'
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
    },
    editIconBox: {
        border: '1px solid #9d0208',
        borderRadius: '5px',
        padding: '2px',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        color: '#dc2f02',
        cursor: 'pointer',
        marginRight: '20px'
    }
}));

function Customer() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [customers, setCustomers] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeCust, setActiveCust] = useState();
    const [trips, setTrips] = useState();
    const [showBill, setShowBill] = useState();
    const d = new Date();
    // const [endDate, setEndDate] = useState(new Date());
    const [tempEndDate, setTempEndDate] = useState(new Date());
    d.setMonth(d.getMonth() - 1);
    // const [startDate, setStartDate] = useState(d);
    const [askDate, setAskDate] = useState();
    const [billBtnLoading, setBillBtnLoading] = useState();

    const getAllCustomers = () => {
        Axios.get('/customer/get-all-customers')
            .then((response) => {
                setCustomers(response.data);
                console.log(response.data);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllCustomers();
    }, []);

    const handleDelete = (id) => {
        Axios.delete(`customer/delete-customer/${id}`)
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

    useEffect(() => {
        activeCust ? console.log(activeCust) : console.log('jjk');
    }, [activeCust]);

    const handleClose = () => {
        setOpen(false);
        setActiveCust('');
    };

    const generateBill = (startDate, endDate, company) => {
        Axios.post(`/trip/get-trip-by-customer/${activeCust._id}`, { startDate, endDate, company })
            .then((response) => {
                setTrips(response.data);
                setBillBtnLoading(false);
                setShowBill(true);
                setAskDate(false);
            })
            .catch((error) => console.log(error));
    };

    const validationSchema = yup.object({
        startDate: yup.string('Please select Start Date').required('Start Date is required'),
        endDate: yup.string('Please select End Date').required('End Date is required'),
        company: yup.string('Please select company').required('Company is required')
    });

    const formik = useFormik({
        initialValues: {
            startDate: d.toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            company: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setBillBtnLoading(true);

            let startDate = new Date(values.startDate);
            let endDate = new Date(values.endDate);
            let company = values.company;

            generateBill(startDate, endDate, company);
        }
    });

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
                        color="secondary"
                    >
                        CUSTOMER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {customers?.length ? (
                        customers.map((customer) => (
                            <Box>
                                <Grid container className={classes.customerCont}>
                                    <Grid
                                        item
                                        xs={9}
                                        onClick={() => {
                                            setActiveCust(customer);
                                            setOpen(true);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Grid container>
                                            <Grid className={classes.customerItems} item xs={4}>
                                                <Typography variant="h3">{customer.name}</Typography>
                                            </Grid>
                                            <Grid className={classes.customerItems} item xs={4}>
                                                <Typography variant="h6">Phone NO. - {customer.contactInfo?.phoneNo}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.customerItems} item xs={3}>
                                        <Box sx={{ pr: 2, ml: 'auto' }} display="flex" alignItems={'center'} justifyContent="space-between">
                                            <Box onClick={() => handleDelete(customer._id)} className={classes.editIconBox}>
                                                <DeleteIcon className={classes.icons} />
                                            </Box>
                                            <Button
                                                onClick={() => {
                                                    setActiveCust(customer);
                                                    setAskDate(true);
                                                }}
                                                className={classes.addBtn}
                                                variant="outlined"
                                                color="secondary"
                                            >
                                                GENERATE BILL
                                            </Button>
                                        </Box>
                                    </Grid>
                                    {/* <Grid className={classes.customerItems} item xs={4}>
                                        <Button onClick={() => generateBill(customer._id)}>GENERATE BILL</Button>
                                    </Grid> */}
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

            <Dialog open={open} onClose={() => handleClose()}>
                <CustomerForm
                    getAllCustomers={getAllCustomers}
                    setOpen={setOpen}
                    setAlertMsg={setAlertMsg}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    activeCust={activeCust}
                />
            </Dialog>

            <Dialog maxWidth="lg" open={askDate}>
                <Box sx={{ m: 2 }} justifyContent={'center'} display="flex" flexDirection={'column'}>
                    <CloseIcon
                        className={[classes.closeIcon, 'closeIcon']}
                        color="red"
                        onClick={() => {
                            setAskDate(false);
                            setBillBtnLoading(false);
                        }}
                    />
                    <form onSubmit={formik.handleSubmit}>
                        <Typography variant="h5" fontSize={'20px'} textAlign={'center'} marginTop="20px">
                            SELECT COMPANY & DATE RANGE
                        </Typography>
                        <Divider sx={{ mt: 1, mb: 3, height: '2px', backgroundColor: 'black' }} />
                        <Box display="flex" alignItems={'center'} flexDirection="column">
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
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
                                        <MenuItem value="swapnil">Swapnil Transport</MenuItem>
                                        <MenuItem value="atlas">Atlas Cargo</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        label="Start Date"
                                        value={formik.values.startDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                        helperText={formik.touched.startDate && formik.errors.startDate}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        label="End Date "
                                        value={formik.values.endDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                        helperText={formik.touched.endDate && formik.errors.endDate}
                                    />
                                </Grid>
                            </Grid>

                            <Box className={classes.wrapperLoading}>
                                <Button
                                    type="submit"
                                    disabled={billBtnLoading}
                                    fullWidth
                                    className={classes.addBtn}
                                    color="secondary"
                                    variant="contained"
                                >
                                    SHOW BILL
                                </Button>
                                {billBtnLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Dialog>

            <Dialog maxWidth="lg" open={showBill}>
                <Bill trips={trips} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
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
