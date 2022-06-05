import { Box, Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
const useStyles = makeStyles((theme) => ({
    root1: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: ' translate(-50%,-50%)',
        // maxWidth: '750px',
        overflow: 'scroll',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        overflowY: 'hidden',
        padding: '20px'
    }
}));

export default function ChallanImages({ updateTrip, challanImages, setImagesOpen, trip, setShowBackdrop }) {
    const classes = useStyles();
    const handleDelete = (index) => {
        updateTrip({ challanImages: challanImages.filter((item, thisIndex) => thisIndex !== index) }, trip._id, false);
    };
    const imagesRef = useRef();
    console.log('BBB', challanImages, trip);
    return (
        <Box>
            <Box p={2} ref={imagesRef}>
                {challanImages.length ? (
                    challanImages.map((item, index) => {
                        return (
                            <Box style={{ height: '100%', width: '100%', position: 'relative', display: 'flex' }}>
                                <img src={item} alt="item" style={{ height: '100%', width: '100%' }} />
                                <span style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <DeleteIcon onClick={() => handleDelete(index)} style={{ color: 'white' }} />
                                </span>
                            </Box>
                        );
                    })
                ) : (
                    <Typography variant="h2">There are no challans added</Typography>
                )}
            </Box>
            <Box style={{ textAlign: 'center', paddingBottom: '20px' }}>
                <ReactToPrint trigger={() => <Button variant="contained">Print</Button>} content={() => imagesRef.current} />
            </Box>
        </Box>
    );
}
