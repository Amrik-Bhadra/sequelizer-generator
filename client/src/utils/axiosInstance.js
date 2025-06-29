import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://sequelizer-api.devmadeeasy.com/api',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});

export default axiosInstance;
