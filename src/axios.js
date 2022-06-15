import axios from 'axios';

var Axios = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
});

export default Axios;
