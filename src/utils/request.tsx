import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getCurrentUrl } from './getCurrentUrl';
import { getWindowData } from './getWindowData';
// import { getAuthStorage, setAuthStorage } from '@containers/auth';

const { uuid } = getWindowData()


const axiosInstance: AxiosInstance = axios.create({
  timeout: 150000,
  baseURL: getCurrentUrl(false) + "/" + uuid + '/api/v2/user/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      ...(config?.headers || {}),
    };

    return Object.assign(config, { headers });
  },
  (error) => Promise.reject(error),
);
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {

    const { error_description, message } = error?.response?.data || {};
    console.log(error?.response?.data);
    const errorText =
      error_description || message || (!error?.response ? 'Can not connect to server.' : 'An unknown error occurred.');

    return Promise.reject(errorText);
  },
);

const request = (config: AxiosRequestConfig) => axiosInstance.request(config);

export default request;
