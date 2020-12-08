import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { getCookie } from './authentication/getCookie';
import Post from './post';
import axios from 'axios';
import './static/profile.css'


export default function Profile() {
	const [userPosts, setUserPosts] = useState([]);
	const [havePost, setHavePost] = useState(false);

	useEffect(() => {
	    const fetchData = async () => {
	      	const items =  await axios("https://instaclone-react-django.herokuapp.com/api/post/");
	      	setUserPosts(items.data)

	      	userPosts.forEach((data) => {
	      		if(data.user === getCookie('user')){
		      		setHavePost(true)
		      	}
	      	})
	  	};
		fetchData();
	}, [userPosts]);

	if(getCookie('isLoggedin') === "false" || getCookie('isLoggedin') === null){
		return <Redirect to='/login' />
	}

	return (	
		<div className="Profile">
			<div className="profile__header">
				{havePost ? 
					<h3 className="header3">Enjoy posting!</h3>
					:
					<p className="ptext">It seems you don't have post yet, make post now!</p>
				}
			</div>
			<div className="profile__posts">
				{userPosts.map(post => (
					post.user === getCookie('user') ?
	        		<Post
	        			postDate={post.date_created}
	        			postId={post.id} 
	        			user={post.user} 
	        			caption={post.caption} 
	        			imageURL={post.photo}
	        			likesLength={post.likes.length}
	        		/>
	        		:
	        		<></>
	      		))}
      		</div>
		</div>
	)
}