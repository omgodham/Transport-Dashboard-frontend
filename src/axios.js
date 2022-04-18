import axios from 'axios';

var Axios = axios.create({
    baseURL: 'http://localhost:3003/'
    /* other custom settings */
});

export default Axios;
