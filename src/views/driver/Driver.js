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
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import DeleteIcon from '@material-ui/icons/Delete';
import DriverForm from './DriverForm';

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

function Driver() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeDriver, setActiveDriver] = useState();

    const getAllDrivers = () => {
        Axios.get('/driver/get-all-drivers')
            .then((response) => setVehicles(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllDrivers();
    }, []);

    const handleClose = () => {
        setOpen(false);
        setActiveDriver();
    };

    const handleDelete = (id) => {
        Axios.delete(`driver/delete-driver/${id}`)
            .then((response) => {
                getAllDrivers();
                setAlertMsg('Driver deleted successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };
    return (
        <div className={classes.root}>
            <Box>
                <Typography variant="h2">DRIVERS</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.addBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        DRIVER
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {vehicles?.length ? (
                        vehicles.map((driver) => {
                            console.log(driver);
                            return (
                                <Box
                                    className={classes.customerCont}
                                    onClick={() => {
                                        setOpen(true);
                                        setActiveDriver(driver);
                                    }}
                                >
                                    <Grid container>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h3">{driver.name}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h6">Driver NO. - {driver.phoneNo}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Box sx={{ pr: 2, ml: 'auto' }}>
                                                <DeleteIcon className={classes.icons} onClick={() => handleDelete(driver._id)} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            );
                        })
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
                <DriverForm
                    getAllDrivers={getAllDrivers}
                    setOpen={setOpen}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    setAlertMsg={setAlertMsg}
                    handleClose={handleClose}
                    activeDriver={activeDriver}
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

export default Driver;
