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
    CircularProgress,
    Skeleton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';
// import CustomerForm from './CustomerForm';
import CloseIcon from '@material-ui/icons/Close';
import noData from '../../images/noData.png';
import CustomerBill from '../customer/CustomerBill';
import BillActions from './BillActions';
import moment from 'moment';
import { getYearlyCustomerBills } from '../customer/helpers';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        backgroundColor: '#fff',
        padding: '20px 10px',
        minHeight: '600px'
    },
    customerSkeleton: {
        width: '100%',
        height: '50px',
        marginTop: '20px',
        borderRadius: '5px'
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
        margin: '15px auto',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        boxShadow: ' rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;',

        [theme.breakpoints.up('sm')]: {
            padding: '20px '
        },
        [theme.breakpoints.up('xs')]: {
            padding: '20px'
        }
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

function CustomerYearlyBills() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [bills, setBills] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeBill, setActiveBill] = useState();
    const [trips, setTrips] = useState();
    const d = new Date();
    // const [endDate, setEndDate] = useState(new Date());
    const [tempEndDate, setTempEndDate] = useState(new Date());
    d.setMonth(d.getMonth() - 1);
    // const [startDate, setStartDate] = useState(d);
    const [askDate, setAskDate] = useState();
    const [billBtnLoading, setBillBtnLoading] = useState();
    const [progress, setProgress] = useState();
    const [companies, setCompanies] = useState([]);
    const [companyProgress, setCompanyProgress] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState();
    const [generatedBill, setGeneratedBill] = useState();
    const [customers, setCustomers] = useState([]);
    const getAllBills = async () => {
        try {
            let billData = await getYearlyCustomerBills(setProgress);
            // console.log(billData)
            setBills(billData);
        } catch (error) {
            console.log("AAA",error)
        }
    };

    useEffect(() => {
        getAllBills();
    }, []);

    useEffect(() => {
        Axios.get('/customer/get-all-customers')
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                // setAlertMessage('Could not get customers');
                // setErrorSnack(true);
            });
    }, []);

    return (
        <div className={classes.root}>
            <Box>
                <Typography textAlign={'center'} variant="h2">
                    YEARLY BILLS
                </Typography>
                {/* <Box className={classes.btnCont}>
                    <Button
                        className={classes.addBtn}
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        color="secondary"
                    >
                        CUSTOMER
                    </Button>
                </Box> */}
                <Divider style={{ margin: '20px 0' }} />
                <Box sx={{ p: 2 }}>
                    {bills?.length ? (
                        bills
                            .slice(0)
                            .reverse()
                            .map((bill) => (
                                <Grid container className={classes.customerCont}>
                                    <Grid item xs={11}>
                                        <Grid container>
                                            <Grid
                                                item
                                                sm={3}
                                                xs={12}
                                                onClick={() => {
                                                    setActiveBill(bill);
                                                    setOpen(true);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Grid container>
                                                    <Grid className={classes.customerItems} item>
                                                        <Typography variant="h5">Bill No. - {bill.billNo}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box>
                                                    <Typography>
                                                        {' '}
                                                        {moment(new Date(bill.startDate)).format('DD-MM-YYYY')} -{' '}
                                                        {moment(new Date(bill.endDate)).format('DD-MM-YYYY')}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box>
                                                    {bill.monthlyBills.every(mBItem => mBItem.isPaid) ? (
                                                        <Typography color={'green'}> Bill paid </Typography>
                                                    ) : (
                                                        <Typography color={'maroon'}>Bill not paid</Typography>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Box>
                                                    <Typography>{customers.find((o) => o._id == bill.customer)?.name}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box
                                            sx={{ ml: 'auto', width: 'fit-content' }}
                                            display="flex"
                                            alignItems={'right'}
                                            justifyContent="space-between"
                                        >
                                            <BillActions
                                                bill={bill}
                                                getAllBills={getAllBills}
                                                setErrorSnack={setErrorSnack}
                                                setSuccessSnack={setSuccessSnack}
                                                setAlertMsg={setAlertMsg}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            ))
                    ) : progress == 100 ? (
                        <Box sx={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Box sx={{ m: 'auto' }}>
                                <img src={noData} width={'200px'} style={{ opacity: '0.5' }} />
                                <Typography style={{ marginTop: '10px', textAlign: 'center' }}> No Data to Display</Typography>
                                <Typography style={{ marginTop: '10px', textAlign: 'center' }}>
                                    {' '}
                                    Generate bills from customers tab.
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            {/* <Dialog open={open} onClose={() => handleClose()}>
                <Box sx={{ position: 'relative' }}>
                    <CustomerForm
                        getAllCustomers={getAllCustomers}
                        setOpen={setOpen}
                        setAlertMsg={setAlertMsg}
                        setErrorSnack={setErrorSnack}
                        setSuccessSnack={setSuccessSnack}
                        activeCust={activeCust}
                        setActiveCust={setActiveCust}
                    />
                    <CloseIcon style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={handleClose} />
                </Box>
            </Dialog> */}


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

export default CustomerYearlyBills;
