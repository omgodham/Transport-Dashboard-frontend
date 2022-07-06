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

function BillActions({ bill, setActiveTrip, setShowDeleteWarn, setErrorSnack, setAlertMsg, getAllBills }) {
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

    return (
        <div>
            <MoreVertIcon onClick={(e) => setAnchorEl(e.currentTarget)} style={{ cursor: 'pointer' }} />
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
            </Menu>

            <Dialog maxWidth="lg" open={showBill}>
                <CustomerBill bill={bill} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
            </Dialog>
        </div>
    );
}

export default BillActions;
