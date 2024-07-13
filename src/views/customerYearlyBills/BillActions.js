import {
    Box,
    Dialog,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SyncSharpIcon from '@material-ui/icons/SyncSharp';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { deleteYearlyBill, refetchYearlyBill } from '../customer/helpers';
import YearlyCustomerBill from './YearlyCustomerBill';

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
    const [anchorEl, setAnchorEl] = useState();
    const [showBill, setShowBill] = useState();
    const handleSyncBill = async () => {
        try {
            let res = await refetchYearlyBill(bill._id);
            getAllBills()
            setAlertMsg('Bills synchronization completed! ');
            setSuccessSnack(true);
        } catch (error) {
            setAlertMsg(error.message);
            setErrorSnack(true);
        }
    };
    const deleteBill = async () => {
        try {
            let res = await deleteYearlyBill(bill._id);
            getAllBills()
            setAlertMsg('Bill deleted! ');
            setSuccessSnack(true);
        } catch (error) {
            setAlertMsg(error.message);
            setErrorSnack(true);
        }
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

                {/* <ListItem button onClick={syncOrders}> */}
                <ListItem button onClick={handleSyncBill}>
                    <ListItemIcon>
                        <SyncSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sync monthly bills" />
                </ListItem>
                <ListItem button onClick={deleteBill}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </ListItem>
            </Menu>

            <Dialog maxWidth="lg" open={showBill}>
                <YearlyCustomerBill bill={bill} setAlertMsg={setAlertMsg} setShowBill={setShowBill} setErrorSnack={setErrorSnack} />
            </Dialog>
        </div>
    );
}

export default BillActions;
