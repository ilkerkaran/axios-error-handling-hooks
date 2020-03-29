import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.baseStoreURL || 'https://simple-firebase-storage.firebaseio.com/'
});

export default instance;