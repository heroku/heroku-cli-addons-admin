/* tslint:disable */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.heroku.com',
  headers: {
    'Authorization': `Bearer ${process.env.HEROKU_API_KEY}`,
    'content-type': 'application/json',
    Accept: 'application/vnd.heroku+json; version=3',
    version: 3,
  }
});

export default axiosInstance;
