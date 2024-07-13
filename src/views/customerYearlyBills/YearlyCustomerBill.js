import {
    Box,
    Button,
    Divider,
    Grid,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PrintIcon from '@material-ui/icons/Print';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ToWords } from 'to-words';
import Axios from '../../axios';
import logo from '../../images/logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '10px',
        margin: '20px',
        minWidth: '400px',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    trip: {
        padding: '5px',
        border: '1px solid black'
    },
    tripItem: {
        padding: '2px',
        border: '1px solid black'
    },
    tableContainer: {
        border: '1px solid black'
    },
    table: {},
    tableHead: {
        borderRadius: '0'
    },
    tableBody: {},
    btn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
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
    signBox: {
        border: '1px solid black',
        width: '100px',
        height: '40px',
        marginBottom: '10px'
    }
}));

function YearlyCustomerBill({ setAlertMessage, setErrorSnack, setShowBill, bill }) {
    const classes = useStyles();
    const componentRef = useRef();
    const [customers, setCustomers] = useState([]);
    const [totalEarning, setTotalEarning] = useState(0);
    const [totalEarningWithComma, setTotalEarningWithComma] = useState();
    const toWords = new ToWords();
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        let tempEarning = 0
        if(bill.monthlyBills.length) {
            tempEarning = bill.monthlyBills.reduce((acc, monthlyBill) => acc + monthlyBill.totalSumOfTrips,0)
      
        }
            setTotalEarning(tempEarning);
            tempEarning = tempEarning.toString();
            var lastThree = tempEarning.substring(tempEarning.length - 3);
            var otherNumbers = tempEarning.substring(0, tempEarning.length - 3);
            if (otherNumbers != '') lastThree = ',' + lastThree;
            tempEarning = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

            setTotalEarningWithComma(tempEarning);
            Axios.get('/company/get-all-companies')
            .then((response) => {
                setCompanies(response.data);
            })
            .catch((error) => console.log(error));
             
            Axios.get('/customer/get-all-customers')
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                setAlertMessage('Could not get customers');
                setErrorSnack(true);
            });
    }, [bill]);

 

    return (
        <div>
            <div className={classes.root}>
                <CloseIcon className={[classes.closeIcon, 'closeIcon']} onClick={() => setShowBill(false)} />
                {bill.monthlyBills.length ? (
                    <div>
                        <div ref={componentRef}>
                            <Box sx={{ backgroundColor: '#fff', p: 2 }}>
                                <Grid sx={{ mb: 2 }}>
                                    <Grid container>
                                        <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                                            <Box>
                                                <img src={logo} alt="logo" width={'100px'} />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                                            <Box minWidth={'200px'}>
                                                <Typography variant="h2" textAlign="center">
                                                    {companies.length ? (
                                                        companies.map((company) => company._id == bill.company && company.name)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Box display="flex">
                                                    <Typography fontSize={'10px'}>
                                                        { companies.length ? (
                                                            companies.map((company) => company._id == bill.company && company.address)
                                                        ) : (
                                                            <Skeleton />
                                                        )}
                                                    </Typography>
                                                    <Typography fontSize={'10px'}>
                                                        GST No. -{' '}
                                                        { companies.length ? (
                                                            companies.map((company) => company._id == bill.company && company.gstNo)
                                                        ) : (
                                                            <Skeleton />
                                                        )}
                                                    </Typography>
                                                    <Typography fontSize={'10px'}>
                                                        Phone No. -{' '}
                                                        { companies.length ? (
                                                            companies.map((company) => company._id == bill.company && company.phoneNo)
                                                        ) : (
                                                            <Skeleton />
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 2, height: '2px', backgroundColor: 'black' }}></Divider>

                                    <Box display={'flex'} justifyContent="space-between">
                                        <Grid container>
                                            <Grid item xs={7}>
                                                <Typography sx={{ mb: 1 }} variant="h6">
                                                    Bill No. - {bill.billNo}
                                                </Typography>
                                                <Typography variant="h6">
                                                    Bill To - M/S{'  '}
                                                    { customers.length ? (
                                                        customers.map((customer) => customer._id == bill.customer && customer.name)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography variant="body4" fontSize={10}>
                                                    {customers.length ? (
                                                        customers.map(
                                                            (customer) => customer._id == bill.customer && customer.address.addressLine1
                                                        )
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                                <Typography variant="body4" fontSize={10}>
                                                    GST No. -{' '}
                                                    {customers.length ? (
                                                        customers.map((customer) => customer._id == bill.customer && customer.gstNo)
                                                    ) : (
                                                        <Skeleton />
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography textAlign={'right'} variant="h6">
                                                    Date : {bill.billDate ? moment(new Date(bill.billDate)).format('DD-MM-YYYY') : moment(new Date(bill.createdAt)).format('DD-MM-YYYY')}
                                                </Typography>
                                                <Typography textAlign={'right'} variant="h6">
                                                    From: {moment(new Date(bill.startDate)).format('DD-MM-YY') } To: {moment(new Date(bill.endDate)).format('DD-MM-YY') }
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Divider sx={{ my: 1, height: '10px' }}></Divider>
                                <Box>
                                    <TableContainer component={Box} className={classes.tableContainer}>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead className={classes.tableHead}>
                                                <TableRow>
                                                    <TableCell className={classes.tripItem}>
                                                        <Typography variant="body3"> SR</Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.tripItem}>
                                                        <Typography variant="body3">Bill Date</Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.tripItem}>
                                                        <Typography variant="body3">Bill No.</Typography>
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        <Typography variant="body3">Amount</Typography>
                                                    </TableCell>
                                                    <TableCell align="right" className={classes.tripItem}>
                                                        <Typography variant="body3">Bill Paid</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody
                                                className={classes.tableBody}
                                                display="flex"
                                                alignItems="right"
                                                justifyContent="right"
                                            >
                                                {bill.monthlyBills
                                                    .sort(function compare(a, b) {
                                                        var dateA = new Date(a.billDate);
                                                        var dateB = new Date(b.billDate);
                                                        return dateA - dateB;
                                                    })
                                                    .map((monthlyBill, index) => (
                                                        <TableRow className={classes.tableRow} key={monthlyBill._id}>
                                                            <TableCell className={classes.tripItem}>
                                                                <Typography variant="body4">{index + 1}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} component="th" scope="row">
                                                                <Typography variant="body4">
                                                                    {moment(new Date(monthlyBill.billDate)).format('DD-MM-YYYY')}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} component="th" scope="row">
                                                                <Typography variant="body4">{monthlyBill.billNo}</Typography>
                                                            </TableCell>
                                                       
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body4">Rs. {monthlyBill.totalSumOfTrips}</Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.tripItem} align="right">
                                                                <Typography variant="body4"> {monthlyBill.isPaid ? 'PAID' : 'NOT PAID'}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Box sx={{ mt: 4 }}>
                                    <Box width="fit-content">
                                        <Grid container>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6">Total monthly bills -</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6" style={{ fontSize: '14px' }}>
                                                        {bill.monthlyBills.length}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box width="fit-content">
                                        <Grid container>
                                            <Grid item>
                                                <Grid container>
                                                    <Grid item>
                                                        <Box sx={{ p: 1 }}>
                                                            <Typography variant="h6">Grand Total - </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box sx={{ p: 1 }}>
                                                            <Typography variant="h6">Rs. {totalEarningWithComma}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box width="fit-content">
                                        <Grid container>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6">In Words - </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="h6">
                                                        {' '}
                                                        {totalEarning && toWords.convert(totalEarning, { currency: true })}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                </Box>
                                <Box
                                    display={'flex'}
                                    alignItems="right"
                                    justifyContent={'space-between'}
                                    sx={{ ml: 'auto', mt: 12, mx: 7 }}
                                >
                                    <Box item alignItems="left">
                                        <Typography textAlign={'center'}>RECEIVED</Typography>
                                    </Box>
                                    <Box item alignItems="left">
                                        <Typography textAlign={'center'}>
                                            {companies.length ? (
                                                companies.map((company) => company._id == bill.company && company.name)
                                            ) : (
                                                <Skeleton />
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </div>

                        <Box display={'flex'} alignItems="center" justifyContent={'center'}>
                            <ReactToPrint
                                trigger={() => (
                                    <Button startIcon={<PrintIcon />} className={classes.btn} variant="contained">
                                        PRINT
                                    </Button>
                                )}
                                content={() => componentRef.current}
                            />
                        </Box>
                    </div>
                ) : (
                    <Box>Loading...</Box>
                )}
            </div>
        </div>
    );
}

export default YearlyCustomerBill;
