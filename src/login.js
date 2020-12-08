import React, { useState } from 'react';
import { GetModalStyle, useStyles } from './layout/modalUI.js';
import './static/App.css';
import './static/login.css'
import axiosInstance from './authentication/axiosInstance';
import { Redirect, useHistory, Link } from "react-router-dom";
import { useGlobalState } from './header';
import { getCookie } from './authentication/getCookie';

export default function Login() {
	const history = useHistory();
	const classes = useStyles();
	const [modalStyle] = useState(GetModalStyle);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorLogin, setErrorLogin] = useState(false);
	const [getUser, setGetUser] = useState(false);
	const [isLogin, setIsLogin] = useGlobalState('isLogin');
	const [signupSuccess] = useGlobalState('signupSuccess')


	if (getUser) {
		const url = 'https://instaclone-react-django.herokuapp.com/api/current_user/'
		let login = true;
		axiosInstance
			.get(url)
			.then(res => {
				document.cookie = `userId = ${res.data.id}`;
				document.cookie = `isLoggedin = ${login}`;
				document.cookie = `user = ${res.data.username}`;
				setGetUser(false);
				history.push('/');
			})
			.catch(err => console.log(err));
	}

	const loginUser = (e) => {
		e.preventDefault();

		const url = 'https://instaclone-react-django.herokuapp.com/api/token/'
		let authData = new FormData();
		
		authData.append('username', username);
		authData.append('password', password);

		axiosInstance
			.post(url, authData)
			.then((res) => {
				document.cookie = "token" + "=" + res.data.token;
				axiosInstance.defaults.headers['Authorization'] = `JWT ${getCookie('token')}`
				console.log(res.data)
				setUsername('');
				setPassword('');
				setGetUser(true);
				setErrorLogin(false);
				setIsLogin(true);
			})
			.catch(err => { 
				console.log('LOGIN ERROR:', err)
				setErrorLogin(true);
				setUsername('');
				setPassword('');
			})
	}

	const getErrors = (name, value) => {
	   	let errors = [];

	   	if(name === 'username' && errorLogin){
	   		errors.push("Incorrect username or password")
	   		return (<>{errors.map((error,index) => <p key={index} style={{color: 'red', fontSize: '12px'}}>{error}</p>)}</>)
	 	}

	 	if(name === 'successSignup' && signupSuccess){
	 		errors.push("New account has been created")
	 		return (<>{errors.map((error,index) => <p key={index} style={{color: 'green', fontSize: '12px'}}>{error}</p>)}</>)
	 	}
	}

	if(getCookie('isLoggedin') === "true"){
		return <Redirect to='/' />
	}

	return (
		<div className="Login">
			<div style={modalStyle} className={classes.paper}>
      	<div className="login__header">
      		<h3>Log in</h3>
      	</div>
      	<form className="user__form" onSubmit={loginUser}>
	      	{getErrors('successSignup', signupSuccess)}
	      	{getErrors('username', username)}
      		<input className="user__input"
      			type="text" 
      			name="username"
      			placeholder="Username" 
      			value={username}
      			onChange={(e) => setUsername(e.target.value)} 
      			required 
      		/>
      		<input className="user__input" 
      			type="password" 
      			name="password"
      			placeholder="Password" 
      			value={password}
      			onChange={(e) => setPassword(e.target.value)} 
      			required 
      		/>
      		<button className="user__submit" type="submit">Log in</button>
      	</form>
      	<p className="signup__link">Don't have an account? <Link to='/account/signup'>Sign up</Link></p>
			</div>
		</div>
	)
}