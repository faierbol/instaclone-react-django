import React, { useState }from 'react';
import axiosInstance from './authentication/axiosInstance';
import { GetModalStyle, useStyles } from './layout/modalUI.js';
import './static/App.css';
import './static/signup.css'
import { useGlobalState } from './header';
import { Redirect, Link, useHistory } from "react-router-dom";
import { getCookie } from './authentication/getCookie';

export default function Signup() {
  const history = useHistory();
  const classes = useStyles();
  const [modalStyle] = useState(GetModalStyle);
	const [newUsername, setNewUsername] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [signupSucess, setSignupSuccess] = useGlobalState('signupSuccess');

	const registerUser = (e) => {
    e.preventDefault();

    const url = 'https://instaclone-react-django.herokuapp.com/api/user/create/'

    const registrationForm = ({
      user: {
        username: newUsername, 
        email: newEmail, 
        password: newPassword
      }
    })
    
    axiosInstance
    	.post(url, registrationForm)
    	.then((res) => {
        console.log(res.data);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewPassword2('');
        setSignupSuccess(true)
        history.push('/login');
      })
      .catch(err => { 
        console.log('REGISTRATION ERROR:', err);
        setNewUsername('')
        setNewEmail('');
        setNewPassword('');
        setNewPassword2('');
      })
  }

  const getErrors = (name, value) => {
   let errors = [];

   if(name === 'newPassword2' && newPassword2 !== '' && newPassword !== newPassword2){
     errors.push('Passwords should be the same')
     return (<>{errors.map((error,index) => <p key={index} style={{color: 'red', fontSize: '12px'}}>{error}</p>)}</>)
   }     

   if(name === 'newUsername' && newUsername !== '' && newUsername.length <= 2){
    errors.push("Username must contain 3 characters or more")
    return (<>{errors.map((error,index) => <p key={index} style={{color: 'red', fontSize: '12px'}}>{error}</p>)}</>)
   }

   if(name === 'newPassword' && newPassword !== '' && newPassword.length <= 7){
    errors.push("Password must contain 8 characters or more")
    return (<>{errors.map((error,index) => <p key={index} style={{color: 'red', fontSize: '12px'}}>{error}</p>)}</>)
   }
  }

  if(getCookie('user')){
    return <Redirect to='/' />
  }

	return(
		<div className="Signup">
      <div style={modalStyle} className={classes.paper}>
        <div className="login__header">
          <h3>Sign up</h3>
        </div>
        <form className="user__form" onSubmit={registerUser}>
          <input 
            className="user__input" 
            type="text" 
            placeholder="Username" 
            name="newUsername"
            onChange={(e) => setNewUsername(e.target.value)}
            minLength="3"
            maxLength="20"
            required />
            {getErrors('newUsername', newUsername)}
          <input 
            className="user__input" 
            type="email"
            name="newEmail"
            placeholder="Email" 
            onChange={(e) => setNewEmail(e.target.value)}
            required />
            {getErrors('newEmail', newEmail)}
          <input 
            className="user__input" 
            name="newPassword"
            type="password" 
            placeholder="Password" 
            onChange={(e) => setNewPassword(e.target.value)}  
            minLength="8"
            required />
            {getErrors('newPassword', newPassword)}
          <input 
            className="user__input" 
            type="password" 
            name="newPassword2"
            placeholder="Confirm password"
            onChange={(e) => setNewPassword2(e.target.value)}
            minLength="8"
            required />
            {getErrors('newPassword2', newPassword2)}
          <button disabled={newPassword !== newPassword2 || newUsername === '' || newEmail === '' || newPassword === ''} className="user__submit" type="submit">Sign up</button>
        </form>
        <p className="login__link">have an account? <Link to='/login'>Login</Link></p>
      </div>
		</div>
	)
}