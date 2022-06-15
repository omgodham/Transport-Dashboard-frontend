import { Grid, TextField, Typography, CircularProgress, Box, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Axios from '../../axios';
import { getPaymentDetailsOfSelectedMonth } from './helpers';

function PaymentDetails({ activeCust, getAllCustomers, setAlertMsg, setSuccessSnack, setErrorSnack, setActiveCust }) {
    const [addPaymentDetailsCheck, setAddPaymentDetailsCheck] = useState(false);
    const [showPaymentDetailsCheck, setShowPaymentDetailsCheck] = useState(false);
    const [detailFound, setDetailFound] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    const [paymentDetails, setPaymentDetails] = useState({
        monthYear: '',
        advance: '0',
        remaining: '0',
        total: '0',
        paymentDone: false
    });
    const { monthYear, advance, remaining, total, paymentDone } = paymentDetails;

    // Note: 1. Add add and save functionality give btns over here itself
    useEffect(async () => {
        if (monthYear && addPaymentDetailsCheck) {
            setFetchingData(true);
            let res = await getPaymentDetailsOfSelectedMonth({ customer: activeCust._id, month: monthYear });
            if (res && res.total) {
                let temp = res;
                temp.monthYear = monthYear;
                setPaymentDetails(temp);
                setDetailFound(true);
            } else {
                setPaymentDetails({
                    ...paymentDetails,
                    advance: '0',
                    remaining: '0',
                    total: '0',
                    paymentDone: false
                });
                setDetailFound(false);
            }
            setFetchingData(false);
        } else if (showPaymentDetailsCheck && monthYear) {
            setFetchingData(true);
            let temp = activeCust.paymentDetails.filter((item) => item.monthYear === monthYear);
            if (temp.length) {
                setPaymentDetails(temp[0]);
                setDetailFound(true);
            } else {
                setPaymentDetails({
                    ...paymentDetails,
                    advance: '0',
                    remaining: '0',
                    total: '0',
                    paymentDone: false
                });
                setDetailFound(false);
            }
            setFetchingData(false);
        }
    }, [monthYear]);

    useEffect(() => {
        setPaymentDetails({
            monthYear: '',
            advance: '0',
            remaining: '0',
            total: '0',
            paymentDone: false
        });
    }, [showPaymentDetailsCheck, addPaymentDetailsCheck]);

    const handleChange = (e) => {
        let temp = { ...paymentDetails };
        temp[e.target.name] = e.target.value;
        if (e.target.name === 'advance' && total) {
            temp.remaining = parseInt(total) - parseInt(e.target.value ? e.target.value : 0);
        }
        setPaymentDetails(temp);
    };

    const handleClick = () => {
        // if (addPaymentDetailsCheck) {
        let temp = activeCust.paymentDetails ? activeCust.paymentDetails : [];
        if (temp.some((item) => item.monthYear === paymentDetails.monthYear)) {
            temp = temp.filter((item) => item.monthYear !== paymentDetails.monthYear);
        }
        Axios.patch(`/customer/update-customer/${activeCust._id}`, { data: { paymentDetails: [...temp, paymentDetails] } })
            .then((response) => {
                setActiveCust(response.data);
                getAllCustomers();
                // setOpen(false);
                setAlertMsg('Customer payment details updated successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
        // }
    };
    return (
        <Grid container>
            {' '}
            <Grid item xs={12}>
                <input
                    type="checkbox"
                    id="addPaymentDetailsCheck"
                    checked={addPaymentDetailsCheck}
                    onChange={(e) => {
                        setAddPaymentDetailsCheck(e.target.checked);
                        setShowPaymentDetailsCheck(!e.target.checked);
                    }}
                />
                <label htmlFor="addPaymentDetailsCheck">Add payment details</label>
            </Grid>
            <Grid item xs={12} mt={2}>
                <input
                    type="checkbox"
                    id="showPaymentDetailsCheck"
                    checked={showPaymentDetailsCheck}
                    onChange={(e) => {
                        setShowPaymentDetailsCheck(e.target.checked);
                        setAddPaymentDetailsCheck(!e.target.checked);
                    }}
                />
                <label htmlFor="showPaymentDetailsCheck">Show previous payment details</label>
            </Grid>
            {(showPaymentDetailsCheck || addPaymentDetailsCheck) && (
                <Grid item xs={12} mt={3}>
                    <TextField
                        id="monthYear"
                        label="Select month (MM-DD-YYYY)"
                        name="monthYear"
                        type="month"
                        fullWidth
                        defaultValue="00-00-0000"
                        value={monthYear}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        // required={!trip}
                    />
                </Grid>
            )}
            {!fetchingData && addPaymentDetailsCheck && detailFound && (
                <Grid item xs={12} mt={2}>
                    <Typography variant="h5" color="success">
                        Note: This payment details are calculated from the trips data of this month if you add this details then previous
                        details of this month will get delete
                    </Typography>
                </Grid>
            )}
            {!fetchingData && showPaymentDetailsCheck && detailFound && (
                <Grid item xs={12} mt={2}>
                    <Typography variant="h5" color="success">
                        Note: This payment details are being shown from data stored in the records for this month if you update this details
                        then previous details of this month will get delete
                    </Typography>
                </Grid>
            )}
            {(addPaymentDetailsCheck || (showPaymentDetailsCheck && detailFound && paymentDetails.monthYear)) && !fetchingData && (
                <Grid item xs={12} mt={2}>
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            id="total"
                            name="total"
                            label="Total Payment"
                            value={total}
                            onChange={handleChange}
                            // error={!remaining}
                            // helperText={!remaining && 'Enter some amount'}
                        />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            id="advance"
                            name="advance"
                            label="Advance Given"
                            value={advance}
                            onChange={handleChange}
                            // error={!advance}
                            // helperText={!advance && 'Enter some amount'}
                        />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            id="remaining"
                            name="remaining"
                            label="Remaining Payment"
                            value={remaining}
                            onChange={handleChange}
                            // error={!remaining}
                            // helperText={!remaining && 'Enter some amount'}
                        />
                    </Grid>

                    {showPaymentDetailsCheck && (
                        <Grid item xs={12} mt={2}>
                            <input
                                type="checkbox"
                                id="paymentDone"
                                checked={paymentDone}
                                onChange={(e) => {
                                    setPaymentDetails({ ...paymentDetails, paymentDone: e.target.checked });
                                }}
                            />
                            <label htmlFor="paymentDone">Payment Completed</label>
                        </Grid>
                    )}
                </Grid>
            )}
            {fetchingData && (
                <Grid item xs={12} mt={2}>
                    <CircularProgress />
                </Grid>
            )}
            {(showPaymentDetailsCheck || addPaymentDetailsCheck) && paymentDetails.monthYear && !detailFound && !fetchingData && (
                <Grid item xs={12} mt={2}>
                    <Typography variant="h5">No details found for this month</Typography>
                </Grid>
            )}
            {
                <Box mt={2}>
                    {' '}
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleClick}
                        disabled={addPaymentDetailsCheck && !parseInt(total)}
                    >
                        {addPaymentDetailsCheck ? 'Add' : 'Update'}
                    </Button>
                </Box>
            }
        </Grid>
    );
}

export default PaymentDetails;
