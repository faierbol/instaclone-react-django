import axios from 'axios';
import { getCookie } from './getCookie';

let csrftoken = getCookie('csrftoken');

const axiosInstance = axios.create({
	timeout: 5000,
	headers:{
		'Content-type':'application/json', 
		'X-CSRFToken':csrftoken, 
		Authorization : getCookie('token') ?
			`JWT ${getCookie('token')}`
			: null,
	},
});

export default axiosInstance;