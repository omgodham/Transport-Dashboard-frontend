import axios from '../../../axios';

export const getSalaryDetailsOfTheDriver = async (data, driverId) => {
    return await axios
        .post(`/driver/get-salary-of-the-month-of-driver/${driverId}`, data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const createNewDriver = async (driverData) => {
    return await axios
        .post(`/driver/create-driver`, driverData)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
