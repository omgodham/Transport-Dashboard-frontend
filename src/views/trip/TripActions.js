import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Axios from '../../axios';

function TripActions({ trip, setActiveTrip, setShowDeleteWarn, setShowDetails, setShowDialog, getAllTrips }) {
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
            <MoreVertIcon onClick={(e) => setAnchorEl(e.currentTarget)} style={{ cursor: 'pointer' }} />
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem
                    onClick={() => {
                        setShowDetails(trip);
                        setShowDialog(true);
                    }}
                >
                    <CreateIcon /> Edit Trip
                </MenuItem>
                {!trip.selfTrip &&
                    (trip.billPaid ? (
                        <MenuItem onClick={handlePaid}>
                            <CloseIcon /> Mark As UnPaid
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handlePaid}>
                            <DoneIcon /> Mark As Paid
                        </MenuItem>
                    ))}
                <MenuItem
                    onClick={() => {
                        setActiveTrip(trip);
                        setShowDeleteWarn(true);
                    }}
                >
                    <DeleteIcon /> Delete Trip
                </MenuItem>
            </Menu>
        </div>
    );
}

export default TripActions;
