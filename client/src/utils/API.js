import axios from 'axios';

export default {
    readBrains(){
        return axios.get('/api/brain-read');
    }
};