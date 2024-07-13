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


export const generateYearlyCustomerBill = async (data) => {
    return await axios
        .post('/yearlycustomerbill/generate-yearly-customer-bill', data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};



export const getYearlyCustomerBills = async (setProgress) => {
    return await axios
        .get('/yearlycustomerbill/get-yearly-customer-bills',{
            onDownloadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const refetchYearlyBill = async (billId,setProgress = (e) =>{}) => {
    return await axios
        .get(`/yearlycustomerbill/refetch-yearly-customer-bill/${billId}`,{
            onDownloadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deleteYearlyBill = async (billId,setProgress = (e) =>{}) => {
    return await axios
        .delete(`/yearlycustomerbill/delete-yearly-bill/${billId}`,{
            onDownloadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
