import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, CircularProgress, Dialog, Divider, Grid, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Axios from '../../axios';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CustomerBill from '../customer/CustomerBill';
import SyncSharpIcon from '@material-ui/icons/SyncSharp';
import AddIcon from '@material-ui/icons/Add';
import { Box } from '@material-ui/core';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/styles';

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

function BillActions({ bill, setActiveTrip, setShowDeleteWarn, setErrorSnack, setSuccessSnack, setAlertMsg, getAllBills }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState();
    const [showBill, setShowBill] = useState();
    const [trips, setTrips] = useState();
    // const [tripBillNo,setTripBillNo] = useState("");
    const [loading, setLoading] = useState();
    const [showAdd,setShowAdd] = useState(false)
    const handlePaid = () => {
        setAnchorEl(null);
        let data = { isPaid: !bill.isPaid };
        Axios.patch(`bill/update-bill/${bill._id}`, { data })
            .then((response) => {
                getAllBills();
            })
            .catch((error) => console.log(error));
    };

    const syncOrders = () => {
        setAlertMsg('Orders synchronization is started.Please wait...');
        setSuccessSnack(true);
        Axios.post(`/trip/get-trip-by-customer/${bill.customer}`, {
            startDate: bill.startDate,
            endDate: bill.endDate,
            company: bill.company
        })
            .then((response) => {
                if (response.data.length) {
                    let tempTrips = [];
                    response.data.map((trip) => tempTrips.push(trip._id));
                    let distinctTrips = [];
                    if(bill.trips?.length)
                     distinctTrips = [...new Set([...tempTrips, ...bill.trips])];
                    else
                    distinctTrips = tempTrips
                    let data = {
                        trips: distinctTrips
                    };

                    Axios.patch(`bill/update-bill/${bill._id}`, { data })
                        .then((response) => {
                            getAllBills();
                            setAlertMsg('Orders synchronization completed! ');
                            setSuccessSnack(true);
                        })
                        .catch((error) => console.log(error));
                } else {
                    setAlertMsg('No trips availble in selected date range');
                    // setErrorSnack(true);
                }
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };
    const addTripManually = (tripNo) =>{
        setLoading(true)
        Axios.patch(`/bill/add-trip-to-bill/${bill._id}`, {
            tripBillNo:tripNo,
           previousTrips:bill.trips,
           companyId:bill.company
        })
            .then((response) => {
                getAllBills();
                setAlertMsg('Trip added successfully');
                setSuccessSnack(true);
                setLoading(false)
                setShowAdd(false)
            }) .catch((error) => {
                setAlertMsg(error.message);
                setErrorSnack(true);
                setLoading(false)
            });
    }

    const formik = useFormik({
        initialValues: {
            tripBillNo: "",
        },
        onSubmit: (values) => {
            addTripManually(values.tripBillNo)
        }
    });
    console.log(bill)
    return (
        <div>
            <Box
                sx={{
                    width: 'fit-content',
                    display: 'flex',
                    padding: '2px',
                    borderRadius: '50%',
                    backgroundColor: '#ede7f6'
                }}
                backgroundColor="secondary"
            >
                <MoreVertIcon onClick={(e) => setAnchorEl(e.currentTarget)} style={{ cursor: 'pointer' }} />
            </Box>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <ListItem
                    button
                    onClick={() => {
                        // setShowDetails(trip);
                        setShowBill(true);
                    }}
                >
                    <ListItemIcon>
                        <CreateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Show Bill" />
                </ListItem>

                {bill.isPaid ? (
                    <ListItem button onClick={handlePaid}>
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mark As UnPaid" />
                    </ListItem>
                ) : (
                    <ListItem button onClick={handlePaid}>
                        <ListItemIcon>
                            <DoneIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mark As Paid" />
                    </ListItem>
                )}
                <ListItem button onClick={syncOrders}>
                    <ListItemIcon>
                        <SyncSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sync Orders" />
                </ListItem>
                <ListItem button onClick={() => setShowAdd(true)}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Trip Manually" />
                </ListItem>
            </Menu>
            <Dialog maxWidth="lg" open={showAdd}>
                <Box sx={{ m: 2 }} justifyContent={'center'} display="flex" flexDirection={'column'}>
                    <CloseIcon
                        className={[classes.closeIcon, 'closeIcon']}
                        color="red"
                        onClick={() => {
                            setShowAdd(false);
                            setLoading(false);
                        }}
                    />
                    <form onSubmit={formik.handleSubmit}>
                        <Typography variant="h5" fontSize={'20px'} textAlign={'center'} marginTop="20px">
                            ADD TRIP
                        </Typography>
                        <Divider sx={{ mt: 1, mb: 3, height: '2px', backgroundColor: 'black' }} />
                        <Box display="flex" alignItems={'center'} flexDirection="column">
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="tripBillNo"
                                        name="tripBillNo"
                                        label="Enter trip bill no/trip no"
                                        value={formik.values.company}
                                        onChange={formik.handleChange}
                                        error={formik.touched.company && Boolean(formik.errors.company)}
                                        helperText={formik.touched.company && formik.errors.company}
                                    >
                                       
                                    </TextField>
                                </Grid>
                            </Grid>

                            <Box className={classes.wrapperLoading}>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    fullWidth
                                    className={classes.addBtn}
                                    color="secondary"
                                    variant="contained"
                                >
                                    DONE
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Dialog>
            <Dialog maxWidth="lg" open={showBill}>
                <CustomerBill bill={bill} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
            </Dialog>
        </div>
    );
}

export default BillActions;
