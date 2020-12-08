import axios from 'axios';
import { getCookie } from './getCookie';

let csrftoken = getCookie('csrftoken');

const axiosMultipart = axios.create({
	timeout: 5000,
	headers:{
		'Content-type':'multipart/form-data', 
		'X-CSRFToken':csrftoken, 
		Authorization : getCookie('token') ?
			`JWT ${getCookie('token')}`
			: null,
	},
});

export default axiosMultipart;