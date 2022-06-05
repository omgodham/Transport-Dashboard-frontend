import axios from 'axios';

var Axios = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
    /* other custom settings */
});

export default Axios;
