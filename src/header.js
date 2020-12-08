import React, { useState }from 'react';
import './static/App.css';
import { Link } from "react-router-dom";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import PostUpload from './postUpload';
import { GetModalStyle, useStyles } from './layout/modalUI.js';
import { createGlobalState } from 'react-hooks-global-state';
import ProfileOption from './profileOption';
import { getCookie } from './authentication/getCookie';

const initialState = { isOpen: false, isLogin: false, signupSuccess: false };
export const { useGlobalState } = createGlobalState(initialState);

export default function Header(){
  const classes = useStyles();
  const [modalStyle] = useState(GetModalStyle);
  const [openPost, setOpenPost] = useGlobalState('isOpen');
  const [isLogin, setIsLogin] = useGlobalState('isLogin');

  return(
    <div className="header">
      <div className="app__nav">
        <Link to="/">
          <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
        </Link>

        {getCookie('isLoggedin') === "true" || isLogin?
          <>
            <button className="login__button" onClick={() => setOpenPost(true)}>Make post</button>
            <div>
              <ProfileOption />
            </div>
          </>
          :
          <>
            <a className="signup__button" href="https://kensidiangco.herokuapp.com/" style={{ textDecoration: 'none' }}>About</a>
          </>
        }
      </div>

      <Modal
        open={openPost}
        onClose={() => setOpenPost(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
        <Fade in={openPost}>
          <div style={modalStyle} className={classes.paper}>
            <div className="login__header">
              <h3>Make post</h3>
            </div>
            <PostUpload />
          </div>
        </Fade>
      </Modal>
    </div>
  )
}