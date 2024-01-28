import axios from '../../../axios';

export const getPaymentDetailsOfSelectedMonth = async (data) => {
    return await axios
        .post('/customer/get-total-payment-of-the-month-of-customer', data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const createCustomer = async (data) => {
    return await axios
        .post('/customer/create-customer', data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
