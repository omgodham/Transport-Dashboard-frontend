import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    Divider,
    Grid,
    Skeleton,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Axios from '../../axios';
import VehicleForm from './VehicleForm';
import CloseIcon from '@material-ui/icons/Close';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import noData from '../../images/noData.png';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        padding: '20px 10px',
        height: '100%',
        backgroundColor: '#fff',
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
        padding: '10px 20px',
        margin: '20px auto',
        border: '1px solid grey',
        borderRadius: '10px'
    },
    customerItems: {
        display: 'flex',
        alignItems: 'center'
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
    },
    vehicleBox: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        justifyContent: 'center',
        borderRadius: '10px',
        // border: `2px solid ${theme.palette.secondary.dark}`,
        backgroundColor: '#fff',
        boxShadow: ' rgba(0, 0, 0, 0.16) 0px 1px 4px',
        '&:hover': {
            transform: `scale(1.02)`,
            cursor: 'pointer',
            transition: 'all 150ms ease-in-out'
        }
    },
    modalStyle: {
        display: 'flex',
        alignItems: 'center',
        // width: '50%',
        margin: 'auto'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        position: 'relative'
    },
    tripItem: {
        padding: '7px',
        border: '1px solid black',
        fontSize: '15px'
    }
}));

function Vehicle() {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [vehicles, setVehicles] = useState([]);
    const [successSnack, setSuccessSnack] = useState();
    const [errorSnack, setErrorSnack] = useState();
    const [alertMsg, setAlertMsg] = useState('');
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [isVehicleMaintainceAdd, setIsVehicleMaintainceAdd] = useState(false);
    const [isPreviousMaintenance, setIsPreviousMaintenance] = useState(false);
    const [vehicleMaintenance, setVehicleMaintenance] = useState({
        amount: 0,
        description: '',
        maintenanceDate: new Date()
    });
    const [progress, setProgress] = useState(0);
    const getAllVehicles = () => {
        Axios.get('/vehicle/get-all-vehicles', {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = 0;
                if (progressEvent.total > 0) {
                    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                } else {
                    percentCompleted = 100; // Fallback if total size is unknown
                }
                setProgress(percentCompleted);
            }
        })
            .then((response) => setVehicles(response.data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getAllVehicles();
    }, []);

    const validationSchema = yup.object({
        number: yup.string('Enter vehicle number').required('Vehicles number is required'),
        name: yup.string('Please enter vehicle name.').required('Name is required'),
        model: yup.string('Please enter vehicle model.').required('Vehicle model is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            number: '',
            model: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let data = {
                name: values.name,
                number: values.number,
                model: values.model
            };
            Axios.post('/vehicle/create-vehicle', { data })
                .then((response) => {
                    getAllVehicles();
                    // setOpen(false);
                    handleClose();
                    setAlertMsg('New vehicle saved successfully');
                    setSuccessSnack(true);
                })
                .catch((error) => {
                    setAlertMsg('Something went wrong');
                    setErrorSnack(true);
                });
        }
    });

    const handleClose = () => {
        setOpenDialog(false);
        setOpen(false);
        setCurrentVehicle(null);
        setVehicleMaintenance({
            maintenance: '',
            amount: 0
        });
        setIsVehicleMaintainceAdd(false);
        setIsPreviousMaintenance(false);
    };
    const handleUpdateVehicle = (e) => {
        e.preventDefault();
        let temp = currentVehicle;
        if (vehicleMaintenance.description) {
            temp.maintenance = [
                ...currentVehicle.maintenance,
                {
                    amount: vehicleMaintenance.amount,
                    description: vehicleMaintenance.description,
                    maintenanceDate: vehicleMaintenance.maintenanceDate
                }
            ];
        }
        Axios.patch(`/vehicle/update-vehicle/${currentVehicle._id}`, temp)
            .then((response) => {
                getAllVehicles();
                handleClose();
                setAlertMsg('Vehicle updated successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };
    const handleDelete = (id) => {
        Axios.delete(`vehicle/delete-vehicle/${id}`)
            .then((response) => {
                getAllVehicles();
                handleClose();
                setAlertMsg('Vehicle deleted successfully');
                setSuccessSnack(true);
            })
            .catch((error) => {
                handleClose();
                setAlertMsg('Something went wrong');
                setErrorSnack(true);
            });
    };
    const [openDialog, setOpenDialog] = React.useState(false);

    const VehicleBox = ({ vehicleData, index }) => {
        return (
            <>
                <Box className={classes.vehicleBox}>
                    <Box display="flex" alignItems={'center'}>
                        <LocalShippingOutlinedIcon sx={{ fontSize: '40px', color: 'black' }} />
                        <Typography style={{ fontSize: '24px', marginLeft: '20px' }} variant="h6">
                            {vehicleData.model}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ my: 2 }}>
                        <Typography style={{ fontSize: '20px' }}>
                            <span style={{ color: 'black' }}>Vehicle No. - </span>
                            {vehicleData.number}
                        </Typography>
                    </Box>
                </Box>
            </>
        );
    };

    return (
        <div className={classes.root}>
            <Box>
                <Box>
                    <Typography textAlign={'center'} variant="h2">
                        VEHICLES
                    </Typography>
                    <Box className={classes.btnCont}>
                        <Button
                            onClick={() => setOpen(true)}
                            className={classes.addBtn}
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            VEHICLE
                        </Button>
                    </Box>
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Grid container spacing={2}>
                    {vehicles.length ? (
                        vehicles.map((vehicle, index) => {
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={3}
                                    lg={3}
                                    // sx={{ display: 'flex' }}
                                    onClick={() => {
                                        setCurrentVehicle(vehicle);
                                        setOpenDialog(true);
                                    }}
                                >
                                    <VehicleBox vehicleData={vehicle} index={index} />
                                </Grid>
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
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <Box className={classes.vehicleBox}>
                                <Skeleton variant="rect" width={'100%'} height={100} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Dialog open={open}>
                <Box sx={{ position: 'relative' }}>
                    <VehicleForm
                        getAllVehicles={getAllVehicles}
                        handleClose={handleClose}
                        setAlertMsg={setAlertMsg}
                        setSuccessSnack={setSuccessSnack}
                        setErrorSnack={setErrorSnack}
                    />
                    <CloseIcon
                        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                        onClick={() => handleClose()}
                    />
                </Box>
            </Dialog>

            {currentVehicle && (
                <Dialog open={openDialog} style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
                    <Box className={classes.paper}>
                        <CloseIcon
                            style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                            onClick={() => handleClose()}
                        />
                        <div className={classes.formCont}>
                            <Typography variant="h2" style={{ textAlign: 'center', margin: '20px auto' }}>
                                Vehicle Details Update
                            </Typography>
                            <form onSubmit={handleUpdateVehicle}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} className={classes.formItems}>
                                        <TextField
                                            fullWidth
                                            id="model"
                                            name="model"
                                            label="Model"
                                            type="model"
                                            value={currentVehicle.model}
                                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.formItems}>
                                        <TextField
                                            fullWidth
                                            id="number"
                                            name="number"
                                            label="Vehicle Number"
                                            value={currentVehicle.number}
                                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, number: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className={classes.formItems}>
                                        <label for="maintenanceCheck">Add maintenance to the vehicle</label>
                                        <input
                                            type="checkbox"
                                            id="maintenanceCheck"
                                            checked={isVehicleMaintainceAdd}
                                            onChange={(e) => setIsVehicleMaintainceAdd(e.target.checked)}
                                        />
                                    </Grid>
                                    {isVehicleMaintainceAdd && (
                                        <>
                                            {' '}
                                            <Grid item xs={12} className={classes.formItems}>
                                                <TextField
                                                    fullWidth
                                                    id="maintenanceAmount"
                                                    name="maintenanceAmount"
                                                    label="Maintenance Amount"
                                                    value={vehicleMaintenance.amount}
                                                    onChange={(e) =>
                                                        setVehicleMaintenance({ ...vehicleMaintenance, amount: e.target.value })
                                                    }
                                                    // error={formik.touched.number && Boolean(formik.errors.number)}
                                                    // helperText={formik.touched.number && formik.errors.number}
                                                    style={{ marginTop: '20px' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} className={classes.formItems}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    maxRows={4}
                                                    id="mintanceDescription"
                                                    name="mintanceDescription"
                                                    label="Maintenance Vehicle"
                                                    value={vehicleMaintenance.description}
                                                    onChange={(e) =>
                                                        setVehicleMaintenance({ ...vehicleMaintenance, description: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="maintenanceDate"
                                                    label="Date of maintenance (MM-DD-YYYY)"
                                                    name="maintenanceDate"
                                                    type="date"
                                                    fullWidth
                                                    // defaultValue="00-00-0000"
                                                    value={vehicleMaintenance.maintenanceDate}
                                                    onChange={(e) =>
                                                        setVehicleMaintenance({ ...vehicleMaintenance, maintenanceDate: e.target.value })
                                                    }
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={12} className={classes.formItems}>
                                        <label for="previousMaintenance">Show previous maintanances</label>
                                        <input
                                            type="checkbox"
                                            id="previousMaintenance"
                                            checked={isPreviousMaintenance}
                                            onChange={(e) => setIsPreviousMaintenance(e.target.checked)}
                                        />
                                    </Grid>

                                    {isPreviousMaintenance && (
                                        <>
                                            {currentVehicle.maintenance.length ? (
                                                <Grid item xs={12}>
                                                    <TableContainer component={Box} className={classes.tableContainer}>
                                                        <Table className={classes.table} aria-label="simple table">
                                                            <TableHead className={classes.tableHead}>
                                                                <TableRow>
                                                                    <TableCell align="left" className={classes.tripItem}>
                                                                        Date (DD-MM-YYYY)
                                                                    </TableCell>
                                                                    <TableCell align="right" className={classes.tripItem}>
                                                                        Description
                                                                    </TableCell>
                                                                    <TableCell align="right" className={classes.tripItem}>
                                                                        Amount
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody
                                                                className={classes.tableBody}
                                                                display="flex"
                                                                alignItems="right"
                                                                justifyContent="right"
                                                            >
                                                                {currentVehicle.maintenance.map((item, index) => (
                                                                    <TableRow className={classes.tableRow} key={index}>
                                                                        <TableCell className={classes.tripItem} component="th" scope="row">
                                                                            {moment(new Date(item.maintenanceDate)).format('DD-MM-YYYY')}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tripItem} align="right">
                                                                            {item.description}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tripItem} align="right">
                                                                            {item.amount}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                            ) : (
                                                <Grid item xs={12} className={classes.formItems}>
                                                    <Typography variant="text">No previous data available</Typography>
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                    <Box className={classes.subBtnCont}>
                                        <Button className={classes.subBtn} variant="contained" fullWidth type="submit">
                                            Update
                                        </Button>
                                        {/* <Button
                                            className={classes.subBtn}
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleDelete(currentVehicle._id)}
                                            style={{ margin: '0 20px', backgroundColor: 'red' }}
                                        >
                                            Delete
                                        </Button> */}
                                    </Box>
                                </Grid>
                            </form>
                        </div>
                    </Box>
                </Dialog>
            )}
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

export default Vehicle;
