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
import ExtraChargesForm from './ExtraChargesForm';

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
        cursor: 'pointer',
        backgroundColor: '#9d0208'
    },
    addBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    }
}));

function ExtraCharges() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [extraCharges, setExtraCharges] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeCharge, setActiveCharge] = useState();

    const getAllExtraCharges = () => {
        Axios.get('/extracharge/get-all-extra-charges')
            .then((response) => setExtraCharges(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllExtraCharges();
    }, []);

    const handleClose = () => {
        setOpen(false);
        setActiveCharge();
    };

    const handleDelete = (id) => {
        Axios.delete(`/extracharge/delete-extra-charge/${id}`)
            .then((response) => {
                getAllExtraCharges();
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
                <Typography variant="h2">EXTRA CHARGES</Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.addBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Extra Charges
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                    {extraCharges?.length ? (
                        extraCharges.map((extraCharge) => {
                            console.log(extraCharge);
                            return (
                                <Box
                                    className={classes.customerCont}
                                    onClick={() => {
                                        setOpen(true);
                                        setActiveCharge(extraCharge);
                                    }}
                                >
                                    <Grid container>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h3">{extraCharge.type}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Typography variant="h6"> - {extraCharge.phoneNo}</Typography>
                                        </Grid>
                                        <Grid className={classes.customerItems} item xs={4}>
                                            <Box sx={{ pr: 2, ml: 'auto' }}>
                                                <DeleteIcon className={classes.icons} onClick={() => handleDelete(extraCharge._id)} />
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
                <ExtraChargesForm
                    getAllExtraCharges={getAllExtraCharges}
                    setOpen={setOpen}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    setAlertMsg={setAlertMsg}
                    handleClose={handleClose}
                    activeCharge={activeCharge}
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

export default ExtraCharges;
