import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Dialog, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Axios from '../../axios';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Box } from '@material-ui/core';
import TripBill from './TripBill';
import Voucher from './Voucher';
import { makeStyles } from '@material-ui/styles';
import ChallanImages from './ChallanImages';
import AssignmentIcon from '@material-ui/icons/Assignment';

const useStyles = makeStyles((theme) => ({
    closeIcon: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        cursor: 'pointer',
        borderRadius: '50%',
        border: '1px solid red',
        fontWeight: 500,
        marginRight: '8px',
        color: theme.palette.grey[100],
        borderColor: theme.palette.grey[100]
    }
}));

function TripActions({ trip, setActiveTrip, setShowDeleteWarn, setShowDetails, setShowDialog, getAllTrips, updateTrip }) {
    const [anchorEl, setAnchorEl] = useState();
    const [showBill, setShowBill] = useState();
    const classes = useStyles();
    const [forCustomer, setForCustomer] = useState(false);
    const [showChallan, setShowChallan] = useState(false);

    const handlePaid = () => {
        setAnchorEl(null);
        let data = { billPaid: !trip.billPaid };
        Axios.patch(`trip/update-trip/${trip._id}`, { data })
            .then((response) => {
                getAllTrips();
            })
            .catch((error) => console.log(error));
    };

    const handleClose = () => {
        setShowBill(false);
        setForCustomer(false);
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
                        <CreateIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText color="secondary" primary="Edit Trip" />
                </ListItem>
                {!trip.selfTrip &&
                    (trip.billPaid ? (
                        <ListItem button onClick={handlePaid}>
                            <ListItemIcon>
                                <CloseIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText color="secondary" primary="Mark As UnPaid" />
                        </ListItem>
                    ) : (
                        <ListItem button onClick={handlePaid}>
                            <ListItemIcon>
                                <DoneIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText color="secondary" primary="Mark As Paid" />
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
                            <AssignmentIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText color="secondary" primary="Transporter Voucher" />
                    </ListItem>
                )}
                {!trip.selfTrip && (
                    <ListItem
                        button
                        onClick={() => {
                            setShowBill(true);
                            setActiveTrip(trip);
                            setForCustomer(true);
                        }}
                    >
                        <ListItemIcon>
                            <AssignmentIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText color="secondary" primary="Customer Voucher" />
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
                        <DescriptionIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText color="secondary" primary="Generate Bill" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        setShowChallan(true);
                    }}
                >
                    <ListItemIcon>
                        <ReceiptIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText color="secondary" primary="Show Challan" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => {
                        setActiveTrip(trip);
                        setShowDeleteWarn(true);
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText color="error" primary="Delete Trip" />
                </ListItem>
            </Menu>
            <Dialog open={showBill}>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ p: 2 }}>
                        <CloseIcon
                            className={[classes.closeIcon, 'closeIcon']}
                            style={{ color: 'black', borderColor: 'black' }}
                            onClick={handleClose}
                        />
                    </Box>
                    <Box sx={{ p: 2 }}>{trip?.selfTrip ? <TripBill trip={trip} /> : <Voucher trip={trip} forCustomer={forCustomer} />}</Box>
                </Box>
            </Dialog>
            <Dialog open={showChallan} onClose={() => setShowChallan(false)}>
                <Box sx={{ p: 2, position: 'default' }} className={classes.tripdetailHead}>
                    <Typography className={classes.cardHeading} textAlign={'center'}>
                        Challans
                    </Typography>
                    <CloseIcon className={[classes.closeIcon, 'closeIcon']} color="red" onClick={() => setShowChallan(false)} />
                </Box>
                <Box>
                    <ChallanImages
                        updateTrip={updateTrip}
                        trip={trip}
                        // challanImages={showDetails?.challanImages}
                        setImagesOpen={setShowChallan}
                        // setShowBackdrop={setShowBackdrop}
                        // setAlertMessage={setAlertMessage}
                        // setErrorSnack={setErrorSnack}
                    />
                </Box>
            </Dialog>
        </div>
    );
}

export default TripActions;
