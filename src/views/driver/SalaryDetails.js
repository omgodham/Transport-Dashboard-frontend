import { Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
const useStyles = makeStyles((theme) => ({}));
function SalaryDetails({ activeDriver, addSalaryDetailsCheck, showSalaryDetailsCheck, setTempSalaryDetails, detailFound, setDetailFound }) {
    const classes = useStyles();
    const [salaryDetails, setSalaryDetails] = useState({
        monthYear: '',
        advance: '',
        remaining: '',
        currentSalary: activeDriver.salary
    });
    const { monthYear, advance, remaining } = salaryDetails;

    useEffect(() => {
        setSalaryDetails({
            monthYear: '',
            advance: '',
            remaining: '',
            currentSalary: activeDriver.salary
        });
    }, [showSalaryDetailsCheck, addSalaryDetailsCheck]);
    useEffect(() => {
        let temp = activeDriver.salaryDetails.filter((item) => item.monthYear === monthYear);
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
                    <Typography variant="h5">No details found for this month</Typography>
                </Grid>
            )}
        </>
    );
}

export default SalaryDetails;
