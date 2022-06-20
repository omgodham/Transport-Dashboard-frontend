import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    InputAdornment,
    Skeleton,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from '../../axios';
import DeleteIcon from '@material-ui/icons/Delete';
import noData from '../../images/noData.png';
import CompanyForm from './CompanyForm';

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
        padding: '15px 20px',
        margin: '20px auto',
        boxShadow: ' rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;',
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
        color: '#9d0208'
    },
    addBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    }
}));

function Company() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [extraCharges, setExtraCharges] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [activeCharge, setActiveCharge] = useState();
    const [progress, setProgress] = useState(0);

    const getAllExtraCharges = () => {
        Axios.get('/company/get-all-companies', {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        })
            .then((response) => {
                setExtraCharges(response.data);
                console.log(response.data);
            })
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
        Axios.delete(`/company/delete-company/${id}`)
            .then((response) => {
                getAllExtraCharges();
                setAlertMsg('Company deleted successfully');
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
                <Typography variant="h2" textAlign={'center'}>
                    COMPANY
                </Typography>
                <Box className={classes.btnCont}>
                    <Button
                        onClick={() => setOpen(true)}
                        className={classes.addBtn}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Company
                    </Button>
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Box sx={{ p: 2 }}>
                    {extraCharges?.length ? (
                        extraCharges.map((extraCharge) => {
                            console.log(extraCharge);
                            return (
                                <Box className={classes.customerCont}>
                                    <Grid container>
                                        <Grid
                                            className={classes.customerItems}
                                            item
                                            xs={4}
                                            onClick={() => {
                                                setOpen(true);
                                                setActiveCharge(extraCharge);
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <Typography variant="h4">{extraCharge.name}</Typography>
                                        </Grid>
                                        <Grid
                                            className={classes.customerItems}
                                            item
                                            xs={4}
                                            onClick={() => {
                                                setOpen(true);
                                                setActiveCharge(extraCharge);
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        >
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
                    ) : progress == 100 ? (
                        <Box sx={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Box sx={{ m: 'auto' }}>
                                <img src={noData} width={'200px'} style={{ opacity: '0.5' }} />
                                <Typography style={{ marginTop: '10px', textAlign: 'center' }}> No Data to Display</Typography>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="rect" height={70} width={'100%'} />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={open} onClose={() => handleClose()}>
                <CompanyForm
                    getAllExtraCharges={getAllExtraCharges}
                    setOpen={setOpen}
                    setErrorSnack={setErrorSnack}
                    setSuccessSnack={setSuccessSnack}
                    setAlertMsg={setAlertMsg}
                    handleClose={handleClose}
                    activeCharge={activeCharge}
                    setActiveCharge={setActiveCharge}
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

export default Company;
