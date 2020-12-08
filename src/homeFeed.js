import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import Post from './post';
import axios from 'axios';
import { useGlobalState } from './header'; 
import { getCookie } from './authentication/getCookie';

export default function HomeFeed() {
	const [posts, setPosts] = useState([]);
  	const [isLogin, setIsLogin] = useGlobalState('isLogin');

	useEffect(() => {
	    const fetchData = async () => {
	      const items =  await axios("https://instaclone-react-django.herokuapp.com/api/post/");
	      setPosts(items.data)
		  };
		fetchData();
	}, [posts]);

	
	if(getCookie('isLoggedin') === "false" || !isLogin){
		return <Redirect to='/login' />
	}
	return (
		<div className="homeFeed">
			<div className="App__content">
	    	{posts.map(post => (
        		<Post
        			postDate={post.date_created}
        			postId={post.id} 
        			user={post.user} 
        			caption={post.caption} 
        			imageURL={post.photo}
        			likesLength={post.likes.length}
        		/>
      		))}
	    	</div>
		</div>
	)
}