import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Dialog, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Axios from '../../axios';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CustomerBill from '../customer/CustomerBill';
import SyncSharpIcon from '@material-ui/icons/SyncSharp';
import { Box } from '@material-ui/core';

function BillActions({ bill, setActiveTrip, setShowDeleteWarn, setErrorSnack, setSuccessSnack, setAlertMsg, getAllBills }) {
    const [anchorEl, setAnchorEl] = useState();
    const [showBill, setShowBill] = useState();
    const [trips, setTrips] = useState();

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
                    let data = {
                        trips: tempTrips
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
                // setAlertMsg(error.message);
                // setErrorSnack(true);
            });
    };

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
            </Menu>

            <Dialog maxWidth="lg" open={showBill}>
                <CustomerBill bill={bill} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
            </Dialog>
        </div>
    );
}

export default BillActions;
