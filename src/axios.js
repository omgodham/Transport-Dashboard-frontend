import axios from 'axios';

var axiosInstance = axios.create({
    baseURL: 'http:localhost:3002/api'
    /* other custom settings */
});

export default axiosInstance;
