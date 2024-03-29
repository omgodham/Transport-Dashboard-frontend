import { Box, Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import Compressor from 'compressorjs';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import Axios from '../../axios';
import SalaryDetails from './SalaryDetails';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        backgroundColor: '#fff'
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
        padding: ' 10px '
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
    submitBtn: {
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary[800]
        }
    },
    closeBox: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '25px',
        height: '25px'
    },
    buttonProgress: {
        color: theme.palette.secondary[800],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    wrapperLoading: {
        width: '100%',
        position: 'relative'
    },
    imgBox: {
        border: '1px solid gray',
        width: 'fit-content',
        borderRadius: '5px',
        padding: '5px'
    },
    imgWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    iconBox: {
        // border: '1px solid gray',
        margin: '10px',
        borderRadius: '5px'
    },
    img: {
        cursor: 'pointer',
        objectFit: 'cover'
    },
    bigImgBox: {
        padding: '10px ',
        position: 'relative'
    }
}));

function DriverForm({
    getAllDrivers,
    setErrorSnack,
    setAlertMsg,
    setSuccessSnack,
    setOpen,
    handleClose,
    activeDriver,
    setActiveDriver,
    savingDriver,
    setSavingDriver,
    setShowBackdrop,
    addingDriver,
    setAddingDriver
}) {
    const classes = useStyles();
    const [addSalaryDetailsCheck, setAddSalaryDetailsCheck] = useState(false);
    const [showSalaryDetailsCheck, setShowSalaryDetailsCheck] = useState(false);
    const [tempSalaryDetails, setTempSalaryDetails] = useState(null);
    const [detailFound, setDetailFound] = useState(false);
    const [showImg, setShowImg] = useState();
    const [activeImg, setActiveImg] = useState();

    const validationSchema = yup.object({
        name: yup.string('Please enter driver name.').required('Name is required'),
        phoneNo: yup
            .string('Enter phone number')
            .required('Phone number is required')
            .min(10, 'Phone No. should be of minimum 10 characters length'),
        salary: yup.string("Enter driver's salary").required('Salary is required'),
        // aadhar: yup.string("Enter driver's Aadhar No.").required('Aadhar No. is required'),
        chargePerTrip: yup.string('Enter Charge Per Trip')
    });

    const formik = useFormik({
        initialValues: {
            name: activeDriver ? activeDriver.name : '',
            phoneNo: activeDriver ? activeDriver.phoneNo : '',
            salary: activeDriver ? activeDriver.salary : '',
            aadharCard: activeDriver ? activeDriver.aadharCard : '',
            license: activeDriver ? activeDriver.license : '',
            chargePerTrip: activeDriver ? activeDriver.chargePerTrip : '',
            salaryDetails: activeDriver ? (activeDriver.salaryDetails ? activeDriver.salaryDetails : []) : []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (activeDriver) {
                setSavingDriver(true);
                // setShowBackdrop(true);
            } else {
                setAddingDriver(true);
            }
            let temp = [...values.salaryDetails];
            if (addSalaryDetailsCheck && activeDriver && !detailFound) {
                temp.push(tempSalaryDetails);
            }
            if ((showSalaryDetailsCheck && activeDriver && detailFound) || (addSalaryDetailsCheck && activeDriver && detailFound)) {
                let index = temp.findIndex((item) => item.monthYear === tempSalaryDetails.monthYear);
                temp[index] = {
                    ...temp[index],
                    advance: tempSalaryDetails.advance,
                    remaining: parseInt(tempSalaryDetails.remaining),
                    currentSalary: tempSalaryDetails.currentSalary
                };
            }

            let data = {
                name: values.name,
                phoneNo: values.phoneNo,
                salary: values.salary,
                aadharCard: values.aadharCard,
                license: values.license,
                chargePerTrip: values.chargePerTrip,
                salaryDetails: temp
            };
            if (!activeDriver)
                Axios.post('/driver/create-driver', { data })
                    .then((response) => {
                        getAllDrivers();
                        handleClose();
                        setAlertMsg('New driver saved successfully');
                        setSuccessSnack(true);
                        setAddingDriver(false);
                    })
                    .catch((error) => {
                        setAddingDriver(false);
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                    });
            else
                Axios.patch(`/driver/update-driver/${activeDriver._id}`, { data })
                    .then((response) => {
                        getAllDrivers();
                        setActiveDriver(response.data);
                        setAlertMsg('Driver details saved successfully');
                        setSuccessSnack(true);
                        setSavingDriver(false);
                        setShowBackdrop(false);
                    })
                    .catch((error) => {
                        setAlertMsg('Something went wrong');
                        setErrorSnack(true);
                        setSavingDriver(false);
                        setShowBackdrop(false);
                    });
        }
    });

    const handleImageCompressionAndConversion = (files, name) => {
        let reader = new FileReader();
        for (const file of files) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    reader.readAsDataURL(result);
                    reader.onload = function () {
                        formik.setFieldValue(name, reader.result);
                    };
                }
            });
        }
    };

    return (
        <div className={classes.formCont}>
            <Box className={classes.closeBox}>
                <CloseIcon onClick={() => handleClose()} />
            </Box>
            <Typography variant="h2" style={{ textAlign: 'center', margin: '10px auto' }}>
                DRIVER DETAILS
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            type="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="phoneNo"
                            type="string"
                            name="phoneNo"
                            label="Phone Number"
                            value={formik.values.phoneNo}
                            onChange={formik.handleChange}
                            error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                            helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="salary"
                            type="number"
                            name="salary"
                            label="Driver's Salary"
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                            error={formik.touched.salary && Boolean(formik.errors.salary)}
                            helperText={formik.touched.salary && formik.errors.salary}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                            }}
                        />
                    </Grid>
                    {/* <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="aadhar"
                            type="string"
                            name="aadhar"
                            label="Driver's Aadhar No."
                            value={formik.values.aadhar}
                            onChange={formik.handleChange}
                            error={formik.touched.aadhar && Boolean(formik.errors.aadhar)}
                            helperText={formik.touched.aadhar && formik.errors.aadhar}
                        />
                    </Grid> */}
                    <Grid item xs={6} className={classes.formItems}>
                        <TextField
                            fullWidth
                            id="chargePerTrip"
                            type="string"
                            name="chargePerTrip"
                            label="Charge Per Trip"
                            value={formik.values.chargePerTrip}
                            onChange={formik.handleChange}
                            error={formik.touched.chargePerTrip && Boolean(formik.errors.chargePerTrip)}
                            helperText={formik.touched.chargePerTrip && formik.errors.chargePerTrip}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        {activeDriver?.aadharCard ? (
                            <Box className={classes.imgWrapper}>
                                <Box className={classes.imgBox}>
                                    <img
                                        className={classes.img}
                                        src={activeDriver.aadharCard}
                                        width="55px"
                                        height={'25px'}
                                        alt="Aadhar Card"
                                        onClick={() => {
                                            setActiveImg(activeDriver.aadharCard);
                                            setShowImg(true);
                                        }}
                                    />
                                </Box>
                                <Box className={classes.iconBox}>
                                    <DeleteIcon />
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <label for="aadharCard">Driver's Aadhar Card</label>
                                <TextField
                                    fullWidth
                                    id="aadharCard"
                                    type="file"
                                    name="aadharCard"
                                    // label="Driver's Aadhar Card"
                                    onChange={(e) => {
                                        handleImageCompressionAndConversion(e.target.files, 'aadharCard');
                                    }}
                                    error={formik.touched.aadharCard && Boolean(formik.errors.aadharCard)}
                                    helperText={formik.touched.aadharCard && formik.errors.aadharCard}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={6} className={classes.formItems}>
                        {activeDriver?.license ? (
                            <Box className={classes.imgWrapper}>
                                <Box className={classes.imgBox}>
                                    <img
                                        className={classes.img}
                                        src={activeDriver.license}
                                        width="55px"
                                        height={'25px'}
                                        alt="Aadhar Card"
                                        onClick={() => {
                                            setActiveImg(activeDriver.license);
                                            setShowImg(true);
                                        }}
                                    />
                                </Box>
                                <Box className={classes.iconBox}>
                                    <DeleteIcon />
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <label for="license">Driver's License</label>
                                <TextField
                                    fullWidth
                                    id="license"
                                    type="file"
                                    name="license"
                                    // label="Driver's License"
                                    onChange={(e) => {
                                        handleImageCompressionAndConversion(e.target.files, 'license');
                                    }}
                                    error={formik.touched.license && Boolean(formik.errors.license)}
                                    helperText={formik.touched.license && formik.errors.license}
                                />
                            </>
                        )}
                    </Grid>
                    {activeDriver && (
                        <>
                            <Grid item xs={12} className={classes.formItems}>
                                <input
                                    type="checkbox"
                                    id="addSalaryDetailsCheck"
                                    checked={addSalaryDetailsCheck}
                                    onChange={(e) => {
                                        setAddSalaryDetailsCheck(e.target.checked);
                                        setShowSalaryDetailsCheck(!e.target.checked);
                                    }}
                                />
                                <label htmlFor="addSalaryDetailsCheck">Add salary details</label>
                            </Grid>

                            <Grid item xs={12} className={classes.formItems}>
                                <input
                                    type="checkbox"
                                    id="showSalaryDetailsCheck"
                                    checked={showSalaryDetailsCheck}
                                    onChange={(e) => {
                                        setShowSalaryDetailsCheck(e.target.checked);
                                        setAddSalaryDetailsCheck(!e.target.checked);
                                    }}
                                />
                                <label htmlFor="showSalaryDetailsCheck">Show previous salary details</label>
                            </Grid>

                            <Grid item xs={12} className={classes.formItems}>
                                <SalaryDetails
                                    activeDriver={activeDriver}
                                    addSalaryDetailsCheck={addSalaryDetailsCheck}
                                    showSalaryDetailsCheck={showSalaryDetailsCheck}
                                    setTempSalaryDetails={setTempSalaryDetails}
                                    detailFound={detailFound}
                                    setDetailFound={setDetailFound}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>{' '}
                <Box className={classes.wrapperLoading} style={{ marginTop: '20px' }}>
                    <Button className={classes.submitBtn} variant="contained" fullWidth type="submit">
                        {activeDriver ? 'Update' : 'Submit'}
                    </Button>
                    {(savingDriver || addingDriver) && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Box>
            </form>
            <Dialog open={showImg}>
                <Box className={classes.bigImgBox}>
                    <Box className={classes.closeBox}>
                        <CloseIcon onClick={() => setShowImg(false)} />
                    </Box>
                    <img src={activeImg} width="400px" alt="Aadhar/License" />
                </Box>
            </Dialog>
        </div>
    );
}

export default DriverForm;
