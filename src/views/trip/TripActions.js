import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Axios from '../../axios';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Box } from '@material-ui/core';

function TripActions({ trip, setActiveTrip, setShowDeleteWarn, setShowDetails, setShowDialog, getAllTrips, setShowBill }) {
    const [anchorEl, setAnchorEl] = useState();

    const handlePaid = () => {
        setAnchorEl(null);
        let data = { billPaid: !trip.billPaid };
        Axios.patch(`trip/update-trip/${trip._id}`, { data })
            .then((response) => {
                getAllTrips();
            })
            .catch((error) => console.log(error));
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
                <MoreVertIcon onClick={(e) => setAnchorEl(e.currentTarget)} style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
            </Box>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <ListItem
                    button
                    onClick={() => {
                        setShowDetails(trip);
                        setShowDialog(true);
                    }}
                >
                    <ListItemIcon>
                        <CreateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Edit Trip" />
                </ListItem>
                {!trip.selfTrip &&
                    (trip.billPaid ? (
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
                    ))}
                {!trip.selfTrip && (
                    <ListItem
                        button
                        onClick={() => {
                            setShowBill(true);
                            setActiveTrip(trip);
                        }}
                    >
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary="Generate Voucher" />
                    </ListItem>
                )}
                <ListItem
                    button
                    onClick={() => {
                        setShowBill(true);
                        setActiveTrip(trip);
                    }}
                >
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Generate Bill" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        setActiveTrip(trip);
                        setShowDeleteWarn(true);
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Delete Trip" />
                </ListItem>
            </Menu>
        </div>
    );
}

export default TripActions;
