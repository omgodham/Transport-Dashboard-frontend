import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { getTrip } from './helpers';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import storage from '../../firebase';

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

export default function ChallanImages({ updateTrip, setImagesOpen, trip, setShowBackdrop, setAlertMessage, setErrorSnack }) {
    const classes = useStyles();
    const [challanImages, setChallanImages] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const handleDelete = (index) => {
        //deletion of file from firebase storage
        var fileRef = ref(storage, challanImages[index]);
        deleteObject(fileRef)
            .then(() => {
                //deleting url from the db only if image gets delete from the firebase storage
                updateTrip({ challanImages: challanImages.filter((item, thisIndex) => thisIndex !== index) }, trip._id, false);
            })
            .catch((error) => {
                setAlertMessage(error.message);
                setErrorSnack(true);
            });
    };

    const imagesRef = useRef();

    useEffect(() => {
        const fetchTrip = async () => {
            setImagesLoaded(true);
            try {
                let tempTrip = await getTrip(trip._id);
                setChallanImages(tempTrip.challanImages);
                setImagesLoaded(false);
            } catch (error) {
                setImagesLoaded(false);
            }
        };
        return fetchTrip();
    }, [trip]);

    return (
        <Box>
            <Box p={2} ref={imagesRef}>
                {challanImages?.length && !imagesLoaded
                    ? challanImages.map((item, index) => {
                          return (
                              <Box style={{ height: '100%', width: '100%', position: 'relative', display: 'flex' }}>
                                  <img
                                      src={item}
                                      alt="item"
                                      style={{ maxHeight: '290mm', maxWidth: '202mm', height: '100%', width: '100%' }}
                                  />
                                  <span style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                      <DeleteIcon onClick={() => handleDelete(index)} style={{ color: 'white' }} />
                                  </span>
                              </Box>
                          );
                      })
                    : challanImages?.length === 0 && !imagesLoaded && <Typography variant="h2">There are no challans added</Typography>}
                {imagesLoaded && <CircularProgress color="inherit" />}
            </Box>
            {challanImages?.length && !imagesLoaded ? (
                <Box style={{ textAlign: 'center', paddingBottom: '20px' }}>
                    <ReactToPrint trigger={() => <Button variant="contained">Print</Button>} content={() => imagesRef.current} />
                </Box>
            ) : (
                ''
            )}
        </Box>
    );
}
