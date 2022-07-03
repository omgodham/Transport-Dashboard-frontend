import axios from '../../../axios';

export const getTrip = async (tripId) => {
    return await axios
        .get(`/trip/get-trip/${tripId}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getTripsDepenedingOnTheChallanAddition = async (startDate, endDate, status) => {
    return await axios
        .post('/trip/get-trips-depending-on-challan-addition', { startDate, endDate, status })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};
