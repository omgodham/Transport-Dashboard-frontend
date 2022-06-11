import axios from 'axios';

var Axios = axios.create({
    baseURL: 'http://localhost:3003/'
});

export default Axios;
