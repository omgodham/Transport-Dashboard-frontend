import { Box, Grid, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { getSalaryDetailsOfTheDriver } from './helpers';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    tripItem: {
        padding: '7px',
        border: '1px solid black',
        fontSize: '15px'
    }
}));
function SalaryDetails({ activeDriver, addSalaryDetailsCheck, showSalaryDetailsCheck, setTempSalaryDetails, detailFound, setDetailFound }) {
    const classes = useStyles();
    const [salaryDetails, setSalaryDetails] = useState({
        monthYear: '',
        advance: '',
        remaining: '',
        currentSalary: activeDriver.salary
    });
    const { monthYear, advance, remaining } = salaryDetails;
    const [advanceReport, setAdvanceReport] = useState([]);
    useEffect(() => {
        setSalaryDetails({
            monthYear: '',
            advance: '',
            remaining: '',
            currentSalary: activeDriver.salary
        });
        setAdvanceReport([]);
    }, [showSalaryDetailsCheck, addSalaryDetailsCheck]);
    useEffect(async () => {
        let temp = activeDriver.salaryDetails.filter((item) => item.monthYear === monthYear);
        if (monthYear && addSalaryDetailsCheck) {
            let res = await getSalaryDetailsOfTheDriver({ month: monthYear }, activeDriver._id);
            console.log('BBB', res);
            try {
                if (res.found) {
                    setSalaryDetails({
                        ...salaryDetails,
                        advance: res.advance,
                        remaining: res.remaining,
                        currentSalary: activeDriver.salary
                    });
                    // setDetailFound(true);
                    setAdvanceReport(res.report);
                    return '';
                }
            } catch (error) {
                console.log(error);
                setAdvanceReport([]);
            }
        }
        if (temp.length) {
            setSalaryDetails(temp[0]);
            setDetailFound(true);
        } else {
            setSalaryDetails({
                ...salaryDetails,
                advance: '',
                remaining: '',
                currentSalary: activeDriver.salary
            });
            setDetailFound(false);
        }
    }, [salaryDetails.monthYear]);
    useEffect(() => {
        setTempSalaryDetails(salaryDetails);
    }, [salaryDetails]);

    const handleChange = (e) => {
        let temp = { ...salaryDetails };
        temp[e.target.name] = e.target.value;
        if (e.target.name === 'advance') {
            temp.remaining = parseInt(temp.currentSalary) - parseInt(e.target.value ? e.target.value : 0);
        }
        setSalaryDetails(temp);
    };

    return (
        <>
            {advanceReport.length ? (
                <Grid item xs={12} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} mb={2}>
                        <Typography variant="h5" color="success">
                            Note: This advance details are calculated from the trips data of this month if you add this details then
                            previous salary details of this month will get delete
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Box} className={classes.tableContainer}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tripItem}>
                                            Date (DD-MM-YYYY)
                                        </TableCell>
                                        <TableCell align="right" className={classes.tripItem}>
                                            Advance Given
                                        </TableCell>
                                        <TableCell align="right" className={classes.tripItem}>
                                            Bhatta Given
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tableBody} display="flex" alignItems="right" justifyContent="right">
                                    {advanceReport.map((eachReport, index) => (
                                        <TableRow className={classes.tableRow} key={index}>
                                            <TableCell className={classes.tripItem} component="th" scope="row">
                                                {moment(new Date(eachReport.advanceGivenDate)).format('DD-MM-YYYY')}
                                            </TableCell>
                                            <TableCell className={classes.tripItem} align="right">
                                                {eachReport.advanceGiven}
                                            </TableCell>
                                            <TableCell className={classes.tripItem} align="right">
                                                {eachReport.bhattaGiven}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            ) : (
                ''
            )}
            {(showSalaryDetailsCheck || addSalaryDetailsCheck) && (
                <Grid item xs={12} className={classes.formItems}>
                    <TextField
                        id="monthYear"
                        label="Select month (MM-DD-YYYY)"
                        name="monthYear"
                        type="month"
                        fullWidth
                        defaultValue="00-00-0000"
                        value={monthYear}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        // required={!trip}
                    />
                </Grid>
            )}
            {(addSalaryDetailsCheck || (showSalaryDetailsCheck && detailFound && salaryDetails.monthYear)) && (
                <Grid item xs={12} className={classes.formItems} mt={2}>
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            id="advance"
                            name="advance"
                            label="Advance Given"
                            value={advance}
                            onChange={handleChange}
                            // error={!advance}
                            // helperText={!advance && 'Enter some amount'}
                        />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            id="remaining"
                            name="remaining"
                            label="Remaining Payment"
                            value={remaining}
                            onChange={handleChange}
                            // error={!remaining}
                            // helperText={!remaining && 'Enter some amount'}
                        />
                    </Grid>
                </Grid>
            )}
            {showSalaryDetailsCheck && salaryDetails.monthYear && !detailFound && (
                <Grid item xs={12} mt={2}>
                    <Typography variant="h5">No details found for this month which you saved</Typography>
                </Grid>
            )}
        </>
    );
}

export default SalaryDetails;
