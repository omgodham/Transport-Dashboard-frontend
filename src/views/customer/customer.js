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
import CustomerForm from './CustomerForm';
import CustomerBill from './CustomerBill';
import CloseIcon from '@material-ui/icons/Close';
import noData from '../../images/noData.png';
import { format } from 'date-fns';
import { generateYearlyCustomerBill } from './helpers';

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
        margin: '15px auto',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        boxShadow: ' rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;',

        [theme.breakpoints.up('sm')]: {
            padding: '15px 20px'
        },
        [theme.breakpoints.up('xs')]: {
            padding: '10px 5px'
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
    addBtn: {},
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
    const [tempEndDate, setTempEndDate] = useState(new Date());
    d.setMonth(d.getMonth() - 1);
    const [askDate, setAskDate] = useState(false);
    const [billBtnLoading, setBillBtnLoading] = useState();
    const [progress, setProgress] = useState(0);
    const [companies, setCompanies] = useState([]);
    const [companyProgress, setCompanyProgress] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState();
    const [generatedBill, setGeneratedBill] = useState();
    const [isRunningYear, setIsRunningYear] = useState(false)
    const [isYearToDate,setIsYearToDate] = useState(false)
    const [isYearly,setIsYearly] = useState(false)
    const getAllCustomers = () => {
        Axios.get('/customer/get-all-customers', {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = 0;
                if (progressEvent.total > 0) {
                    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                } else {
                    percentCompleted = 100; // Fallback if total size is unknown
                }
                setProgress(percentCompleted);
            }
        })
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllCustomers();
    }, []);

    useEffect(() => {
        Axios.get('/company/get-all-companies', {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = 0;
                if (progressEvent.total > 0) {
                    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                } else {
                    percentCompleted = 100; // Fallback if total size is unknown
                }
                setCompanyProgress(percentCompleted);
            }
        })
            .then((response) => {
                setCompanies(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    const handleDelete = () => {
        Axios.delete(`customer/delete-customer/${activeCust._id}`)
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

    const handleClose = () => {
        setOpen(false);
        setActiveCust(null);
    };

    const generateBill = (startDate, endDate, company,billDate) => {
        Axios.post(`/trip/get-trip-by-customer/${activeCust._id}`, { startDate, endDate, company })
            .then((response) => {
                if (response.data.length) {
                    let tempTrips = [];
                    response.data.map((trip) => tempTrips.push(trip._id));
                    let tempCompany = companies.find((company) => company._id == response.data[0].company);
                    let data = {
                        startDate: startDate,
                        endDate: endDate,
                        trips: tempTrips,
                        customer: activeCust._id,
                        company: tempCompany._id,
                        billDate:billDate
                    };

                    Axios.post('/bill/generate-bill', { data }).then((resData) => {
                        handleBillDateFormClose()
                        setAlertMsg('Bill generated check it in bill tab');
                        setSuccessSnack(true);
                    });
                } else {
                    handleBillDateFormClose()
                    setAlertMsg('No trips availble in selected date range');
                    setErrorSnack(true);
                }
            })
            .catch((error) => {
                handleBillDateFormClose()
                setAlertMsg('Something went wrong');
                // setAlertMsg(error.message);
                setErrorSnack(true);
            });
    };

    const validationSchema = yup.object({
        startDate: yup.string('Please select Start Date').required('Start Date is required'),
        endDate: yup.string('Please select End Date').required('End Date is required'),
        billDate: yup.string('Please select bill Date').required('Bill date is required'),
        company: yup.string('Please select company').required('Company is required')
    });
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const formik = useFormik({
        initialValues: {
            startDate: d.toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            billDate: new Date().toISOString().split('T')[0],
            company: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setBillBtnLoading(true);
            // return 
            let startDate = new Date(values.startDate);
            let endDate = new Date(values.endDate);
            let billDate = new Date(values.billDate);
            let company = values.company;
            if(!isYearly){
                generateBill(startDate, endDate, company,billDate);
                // alert("BBDS333")
            }else{
                generateYearlyBill(startDate, endDate, company,billDate)
            }
        }
    });

    const handleBillDateFormClose = () =>{
        setAskDate(false);
        setBillBtnLoading(false);
        setActiveCust(null)
        setIsYearly(false)
        setIsRunningYear(false)
        setIsYearToDate(false)
    }
    const handleCurrentYearChange = (e) => {
        setIsRunningYear(e.target.checked);
        setIsYearToDate(false);
        if (e.target.checked) {
            const today = new Date();

            const currentYear = today.getFullYear();

            const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
            const endOfYear = new Date(currentYear, 11, 31); // December 31st of the current year

            const startOfYearStr = formatDate(startOfYear);
            const endOfYearStr = formatDate(endOfYear);
            formik.setFieldValue('startDate', startOfYearStr);
            formik.setFieldValue('endDate', endOfYearStr);
        } else {
            formik.setFieldValue('startDate', d.toISOString().split('T')[0]);
            formik.setFieldValue('endDate', new Date().toISOString().split('T')[0]);
        }
    };
    const getLastYearDate = () =>{
        const today = new Date();

        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return oneYearAgo
    }
    const handleYearToDateChange = (e) => {
        setIsYearToDate(e.target.checked);
        setIsRunningYear(false);
        if (e.target.checked) {
            const today = new Date();

            const oneYearAgo = getLastYearDate();

            // Format the dates
            const startDateStr = formatDate(oneYearAgo);
            const endDateStr = formatDate(today);
            formik.setFieldValue('startDate', startDateStr);
            formik.setFieldValue('endDate', endDateStr);
        } else {
            formik.setFieldValue('startDate', d.toISOString().split('T')[0]);
            formik.setFieldValue('endDate', new Date().toISOString().split('T')[0]);
        }
    };
  
    const generateYearlyBill = (startDate, endDate, thisCompany,billDate) => {
        let tempCompany = companies.find((company) => company._id == thisCompany);
        let data = {
            startDate: startDate,
            endDate: endDate,
            customer: activeCust._id,
            company: tempCompany._id,
            billDate:billDate
        };
        generateYearlyCustomerBill(data)
            .then((response) => {
                    handleBillDateFormClose()
                    setAlertMsg('Bill generated check it in yearly bills tab');
                    setSuccessSnack(true);
            })
            .catch((error) => {
                handleBillDateFormClose()
                setAlertMsg(error.message);
                setErrorSnack(true);
            });
    };
    return (
        <div className={classes.root}>
            <Box>
                <Typography textAlign={'center'} variant="h2">
                    CUSTOMERS
                </Typography>
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
                <Divider style={{ margin: '20px 0' }} />
                <Box sx={{ p: 2 }}>
                    {customers?.length ? (
                        customers.map((customer) => (
                            <Grid container spacing={1} className={classes.customerCont}>
                                <Grid
                                    item
                                    sm={9}
                                    onClick={() => {
                                        setActiveCust(customer);
                                        setOpen(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Grid container>
                                        <Grid className={classes.customerItems} item>
                                            <Typography variant="h5">{customer.name}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid className={classes.customerItems} item sm={3}>
                                    <Box sx={{ pr: 2, ml: 'auto' }} display="flex" alignItems={'center'} justifyContent="space-between">
                                        {/* <Box
                                            onClick={() => {
                                                // handleDelete(customer._id);
                                                setActiveCust(customer);
                                                setConfirmDelete(true);
                                            }}
                                            className={classes.editIconBox}
                                        >
                                            <DeleteIcon className={classes.icons} />
                                        </Box> */}
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
                            </Grid>
                        ))
                    ) : progress == 100 ? (
                        <Box sx={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Box sx={{ m: 'auto' }}>
                                <img src={noData} width={'200px'} style={{ opacity: '0.5' }} />
                                <Typography style={{ marginTop: '10px', textAlign: 'center' }}> No Data to Display</Typography>
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

            <Dialog open={open} onClose={() => handleClose()}>
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
            </Dialog>

            <Dialog
                open={confirmDelete}
                onClose={() => {
                    setConfirmDelete(false);
                    setActiveCust(null);
                }}
            >
                <DialogTitle>
                    <Box sx={{ position: 'relative' }}>
                        <Typography variant="h6" fontSize={17}>
                            Do you want to delete customer ?
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setConfirmDelete(false);
                            setActiveCust(null);
                        }}
                        variant="outlined"
                        color="secondary"
                    >
                        {' '}
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete()} variant="contained" color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth="lg" open={askDate}>
                <Box sx={{ m: 2 }} justifyContent={'center'} display="flex" flexDirection={'column'}>
                    <CloseIcon
                        className={[classes.closeIcon, 'closeIcon']}
                        color="red"
                        onClick={handleBillDateFormClose}
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
                                        {companies.length ? (
                                            companies.map((company) => {
                                                return <MenuItem value={company._id}>{company.name}</MenuItem>;
                                            })
                                        ) : companyProgress == 100 ? (
                                            <MenuItem value="none">Company not available</MenuItem>
                                        ) : (
                                            <>
                                                <MenuItem value="none">
                                                    <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                                </MenuItem>
                                                <MenuItem value="none">
                                                    <Skeleton width={'100%'} height={'30px'} animation="wave" />
                                                </MenuItem>
                                            </>
                                        )}
                                    </TextField>
                                </Grid>
                                {/* TODO:Add here the option to select year */}
                                <Grid item xs={12} className={classes.formItems}>
                                        <label for="isYearly">Generate Yearly Customer Bill</label>
                                        <input
                                            type="checkbox"
                                            id="isYearly"
                                            checked={isYearly}
                                            onChange={(e) => setIsYearly(e.target.checked)}
                                        />
                                    </Grid>

                                {isYearly && <>
                                <Grid item xs={6} className={classes.formItems}>
                                        <label for="currentYear">Current Year(Jan {new Date().getFullYear()} - Dec {new Date().getFullYear()})</label>
                                        <input
                                            type="checkbox"
                                            id="currentYear"
                                            checked={isRunningYear}
                                            onChange={handleCurrentYearChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.formItems}>
                                        <label for="yearToDate">Year To Date({format(getLastYearDate(), "dd MMM yyyy")} - {format(new Date(), "dd MMM yyyy")})</label>
                                        <input
                                            type="checkbox"
                                            id="yearToDate"
                                            checked={isYearToDate}
                                            onChange={handleYearToDateChange}
                                        />
                                    </Grid>
                                </>}
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
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        id="billDate"
                                        name="billDate"
                                        label="Bill Date"
                                        value={formik.values.billDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.billDate && Boolean(formik.errors.billDate)}
                                        helperText={formik.touched.billDate && formik.errors.billDate}
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
                                    GENERATE BILL
                                </Button>
                                {billBtnLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Dialog>

            <Dialog maxWidth="lg" open={showBill}>
                <CustomerBill trips={trips} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
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
