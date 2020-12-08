import React, { useState } from 'react';
import { Menu, MenuItem, Button } from "@material-ui/core/"
import { useGlobalState } from './header.js';
import Avatar from "@material-ui/core/Avatar";
import { Link, Redirect } from "react-router-dom";
import axiosInstance from './authentication/axiosInstance';
import { getCookie } from './authentication/getCookie';
import './static/profileOption.css';

export default function ProfileOption() {
  	const [isLogin, setIsLogin] = useGlobalState('isLogin');
  	const [anchorEl, setAnchorEl] = useState(null);
  	const [username, setUsername] = useState('')

  	if (isLogin) {
		const url = 'https://instaclone-react-django.herokuapp.com/api/current_user/'
		axiosInstance
			.get(url)
			.then(res => {
				setUsername(res.data.username);
			})
			.catch(err => console.log(err));
	}

	const handleMenu = (e) =>{
		e.preventDefault();

		setAnchorEl(e.currentTarget);
	}

	const closeMenu = () =>{
		setAnchorEl(null);
	}

	const handleLogout = (e) => {
	    e.preventDefault();

	    let notLogin = false;
	    let dateNow = Date();
	    document.cookie = "token= ; expires =" + dateNow;
	    document.cookie = "user= ; expires =" + dateNow;
	    document.cookie = `isLoggedin = ${notLogin}`;
	    document.cookie = "userId= ; expires =" + dateNow;

	    setIsLogin(false);
	    setAnchorEl(null);
	}

	return (
		<div>
			<Avatar 
		    	className="post__avatar"
		    	alt={username}
				src="/static/images/avatar/1.png"
				aria-controls="profile-menu"
				aria-haspopup="true"
				onClick={handleMenu}
				style={{cursor: 'pointer'}}></Avatar>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={anchorEl}
              keepMounted
              getContentAnchor={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              onClose={closeMenu}
              closeAfterTransition
              className="Menu"
            >
              <Link className="link" to="/account/profile"><MenuItem onClick={() => setAnchorEl(false)}>My posts</MenuItem></Link>
              <MenuItem onClick={handleLogout} className="menuitem">Logout</MenuItem>
            </Menu>
        </div>
	)
}