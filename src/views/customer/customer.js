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

import DeleteIcon from '@material-ui/icons/Delete';
import CustomerForm from './CustomerForm';

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

function Customer() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [customers, setCustomers] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeCust, setActiveCust] = useState();

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
                    >
                        CUSTOMER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {customers?.length ? (
                        customers.map((customer) => (
                            <Box
                                className={classes.customerCont}
                                onClick={() => {
                                    setActiveCust(customer);
                                    setOpen(true);
                                }}
                            >
                                <Grid container>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Typography variant="h3">{customer.name}</Typography>
                                    </Grid>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Typography variant="h6">Phone NO. - {customer.contactInfo?.phoneNo}</Typography>
                                    </Grid>
                                    <Grid className={classes.customerItems} item xs={4}>
                                        <Box sx={{ pr: 2, ml: 'auto' }}>
                                            <DeleteIcon className={classes.icons} onClick={() => handleDelete(customer._id)} />
                                        </Box>
                                    </Grid>
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
