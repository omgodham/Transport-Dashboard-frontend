import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/system';
import React, { useState } from 'react';
import theme from '../../themes';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '10px'
    },
    tripSkeleton: {
        width: '100%',
        height: '50px',
        marginTop: '40px',
        borderRadius: '5px',
        backgroundColor: theme.palette.grey[300],
        animation: `$myEffect 1000ms ease infinite alternate`
    },
    '@keyframes myEffect': {
        to: {
            opacity: 0.5
        }
    }
}));

function AllTrips() {
    const classes = useStyles();
    const [trips, setTrips] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(true);

    setTimeout(() => {
        setTripsLoading(false);
    }, 3000);

    return (
        <div className={classes.root}>
            <Typography variant="h2"> ALL TRIPS</Typography>
            <Box sx={{ m: 2 }}>
                {trips.length ? (
                    trips.map((trip) => <Box></Box>)
                ) : tripsLoading ? (
                    <>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                        <Box className={classes.tripSkeleton}></Box>
                    </>
                ) : (
                    <Box>
                        <Typography>No Data Available</Typography>
                    </Box>
                )}
            </Box>
        </div>
    );
}

export default AllTrips;
