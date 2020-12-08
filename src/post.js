import React, { useEffect, useState } from 'react';
import './static/post.css';
import Avatar from "@material-ui/core/Avatar";
import axios from 'axios';
import axiosInstance from './authentication/axiosInstance';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { GetModalStyle, useStyles } from './layout/modalUI.js';
import { getCookie } from './authentication/getCookie';

export default function Post({likesLength, postId, user, imageURL, caption, postDate}) {
	let imgURL = `https://instaclone-react-django.herokuapp.com${imageURL}`
	const classes = useStyles();
	const [modalStyle] = useState(GetModalStyle);

	const [deletePost, setDeletePost] = useState(false);

	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	const [userComment, setUserComment] = useState([]);
	const [ownComment, setOwnComment] = useState({
		user: '',
		id: 0,
		own: false,
		option: false
	});
	const [openPostLikes, setOpenPostLikes] = useState(false);
	const [likesData] = useState({likes: []});
	const [likeData, setLikeData] = useState([]);
	const [userLiked, setUserLiked] = useState(false);
	const [focus, setFocus] = useState([]);

	useEffect(() => {
    	const fetchData = async () => {
	    	const items =  await axios("https://instaclone-react-django.herokuapp.com/api/post/");
	    	setLikeData(items.data)

		    items.data.forEach((liked) => {
		    	if(liked.id === postId) {
			    	liked.likes.forEach((likers) => {
			    		if(likers === parseInt(getCookie('userId'))){
			    			setUserLiked(true);
			    		}
			    	});
		    }});
		};
		fetchData();
	}, [likeData]);

	useEffect(() => {
	    const fetchData = async () => {
		    const items =  await axios("https://instaclone-react-django.herokuapp.com/api/comment/");
		      setComments(items.data);

		      items.data.forEach(comment => {
		      	if(comment.user === getCookie('user')){
		      		setOwnComment({own: true});
		      	}
		      })
	  		};
			fetchData();
	}, [comments]);

	const like = (e) => {
		e.preventDefault();
		const url = `https://instaclone-react-django.herokuapp.com/api/post/update/${postId}/`

		likeData.forEach((likers) => {
			if(likers.id === postId) {
				likers.likes.forEach((like) => {
					likesData.likes.push(like);
				});
			}
	  });

	  likesData.likes.push(parseInt(getCookie('userId')));

		axiosInstance
			.put(url, likesData)
			.then((res) => {
				console.log(res.data);
				setUserLiked(true)
			})
			.catch(err => {
				console.log(err, likesData);
			})
	}

	const unlikePost = (e) => {
		e.preventDefault();
		const url = `https://instaclone-react-django.herokuapp.com/api/post/update/${postId}/`

		let newLikers = {
			likes: []
		}

		likeData.forEach((likers) => {
			if(likers.id === postId) {
				likers.likes.forEach((like) => {
					newLikers.likes.push(like);
				});
			}
	  	});

		if(newLikers.likes.indexOf(parseInt(getCookie('userId'))) !== -1) {
			newLikers.likes.splice(newLikers.likes.indexOf(parseInt(getCookie('userId'))), 1);
		}

		axiosInstance
			.put(url, newLikers)
			.then((res) => {
				console.log(res.data);
				setUserLiked(false);
			})
	}

	const postComment = (e) => {
	    e.preventDefault();

	    const url = 'https://instaclone-react-django.herokuapp.com/api/comment/create/';

	   	let commentData = ({
	   		post: postId,
	   		comment: comment,
	   		user: getCookie('user')
   		});

	   	axiosInstance
	   		.post(url, commentData)
	   		.then((res) => {
	   			console.log(res.data)
	    		setComment('')
	   		})
	   		.catch(err => { console.log('ERROR:', err, "Data:", commentData, getCookie('token'), getCookie('user'), getCookie('userId'))})
	}

  	const deleteSubmit = (e) => {
  		e.preventDefault();

		const url = `https://instaclone-react-django.herokuapp.com/api/post/delete/${postId}`

		 axiosInstance
	    	.delete(url)
	    	.then((res) => {
	    		console.log(res.data)
	    		setDeletePost(false);
	    	})
	    	.catch(err => { console.log('ERROR:', err)})
	}

  	const cancelOption = (e) => {
  		e.preventDefault();
  		setDeletePost(false);
  	}
  	const reportSubmit = (e) =>{
  		e.preventDefault();
  		setTimeout(() => alert(`Reported! ${user} post will reviewed soon, Thanks for your concern.`), 3000)
  		setDeletePost(false);
  		setOwnComment({
  			option: false
  		});
  	}

  	const commentFocus = (e) => {
  		e.preventDefault();

  		focus.focus()
  	}

  	const deleteComment = (e) => {
  		e.preventDefault();
			
			const url = `https://instaclone-react-django.herokuapp.com/api/comment/delete/${ownComment.id}`

		 	axiosInstance
	    	.delete(url)
	    	.then((res) => {
	    		console.log(res.data);
	    		setOwnComment({option: false});
	    	})
	    	.catch(err => { console.log('ERROR:', err, comment)})
  	}

	return (
		<div className="Post">
			<div className="post__header">
				<Avatar 
			    	className="post__avatar"
			    	alt={user}
			    	src="/static/images/avatar/1.png"
		   		></Avatar>
				<h4>{user}</h4>
			</div>
			<h2 className="post__option" onClick={()=> setDeletePost(true)}>...</h2>
			<img className="post__image" src={imgURL} alt="" />

			<div className="post__buttons">
				<div className="button__div">
					{userLiked ?
		  				<p className="like__button" onClick={unlikePost}>Unlike</p>
		  			:
		  				<p className="like__button" onClick={like}>Like</p>
			  		}
					<p className="commentSec__button" onClick={commentFocus}>Comment</p>
				</div>
				{likesLength !== 0 ? 
					<p className="post__likeCounts" onClick={() => setOpenPostLikes(true)}>{likesLength} minion liked this</p>
					:
					<p style={{color: "#404040", fontSize: "12px", marginRight: "5px"}}>Be the first to like this post</p>
				}
			</div>

			<div className="post__caption">
				<h4 className="post__text"><strong>{user}</strong> {caption}</h4>
				<p className="post__date">{postDate}</p>
			</div>

			{comments.map(comment => (
				comment.post === postId ?
				<div className="post__comment">
					<h4 className="comment__text" onClick={() => setOwnComment({user: comment.user, id: comment.id, option: true})}><strong>{comment.user}</strong> {comment.comment}</h4>
				</div>
				:
				<></>
			))}
			<form className="post__input" onSubmit={postComment}>
				<input
					className="comment__input" 
					type="text" 
					placeholder="Add a comment"
					onChange={(e) => setComment(e.target.value)}
					id="comment"
					name="comment"
					value={comment}
					ref={(input) => { setFocus(input); }}
				/>
				{!comment ? 
					<button type="submit" disabled={!comment} className="disabled">Post</button>
					:
					<button type="submit" disabled={!comment} className="comment__button">Post</button>
				}
			</form>
			<Modal
			    open={deletePost}
			    onClose={() => setDeletePost(false)}
			    closeAfterTransition
		        BackdropComponent={Backdrop}
		        BackdropProps={{
		          timeout: 500,
		        }}>
			    <Fade in={deletePost}>
			        <div style={modalStyle} className={classes.paper}>
			        {user === getCookie('user') ?
			        	<div className="option__button"><button className="delete__button" onClick={deleteSubmit}>Delete</button>
			        	<button className="cancel__button" onClick={cancelOption}>Cancel</button></div>
			        	:
			        	<div className="option__button">
			        	<button className="delete__button" onClick={reportSubmit}>Report</button>
			        	<button className="cancel__button" onClick={cancelOption}>Cancel</button>
			        	</div>
			        }
			        </div>
	       		</Fade>
			</Modal>
			<Modal
			    open={ownComment.option}
			    onClose={() => setOwnComment({option: false})}
			    closeAfterTransition
		        BackdropComponent={Backdrop}
		        BackdropProps={{
		          timeout: 500,
		        }}>
			    <Fade in={ownComment.option}>
			        <div style={modalStyle} className={classes.paper}>
			        {ownComment.user === getCookie('user') ?
			        	<div className="option__button">
				        	<button className="delete__button" onClick={deleteComment}>Delete</button>
				        	<button className="cancel__button" onClick={cancelOption}>Cancel</button>
						</div>	
			        	:
			        	<div className="option__button">
				        	<button className="delete__button" onClick={reportSubmit}>Report</button>
				        	<button className="cancel__button" onClick={cancelOption}>Cancel</button>
			        	</div>
			        }
			        </div>
	       		</Fade>
			</Modal>
			<Modal
				open={openPostLikes}
				onClose={() => setOpenPostLikes(false)}
				closeAfterTransition
		        BackdropComponent={Backdrop}
		        BackdropProps={{
		            timeout: 500,
		        }}>
			    <Fade in={openPostLikes}>
			        <div style={modalStyle} className={classes.paper}>
			        	<div><h3 className="reactors__header">Likers</h3></div>
			        	{likeData.map((likers) => (
			        		likers.id === postId ?
			        			likers.likers_details.map((details) => (
			        				<div className="user__likedPost">
						  				<Avatar 
									    	className="post__avatar"
									    	alt={details.username}
									    	src="/static/images/avatar/1.png"></Avatar>
									    <h3 className="post__text">{details.username}</h3>
									</div>
			        			))
			        		:
		        			<></>
			        	))}
			        </div>
		    	</Fade>
			</Modal>
		</div>
	)
}