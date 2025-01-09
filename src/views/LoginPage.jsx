import FullPageLoader from '../components/FullPageLoader.jsx';
import {useState} from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';


function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('login');
  const [userCreds,setUserCreds] = useState({});
  console.log('AUth is working',auth);
  const navigate = useNavigate();

  function handleCreds(e){
    setUserCreds({...userCreds, [e.target.name]: e.target.value});
    console.log(userCreds);
  }
  function handleLogin(e) {
    e.preventDefault(); // Prevent form submission if using a form
  
    // Ensure email and password are provided
    if (!userCreds.email || !userCreds.password) {
      console.error('Email or password is missing');
      return;
    }
  
    signInWithEmailAndPassword(auth, userCreds.email, userCreds.password)
      .then((userCredential) => {
        // Successful login
        const uid = userCredential.user.uid;
        console.log('User signed in:', userCredential.user);

        navigate(`/user/${uid}`);
      })
      .catch((error) => {
        // Handle errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
      });
  }
  

  
    return (
      <>
        { isLoading && <FullPageLoader></FullPageLoader> }
        <h1>CyberStorm Scavenger Hunt</h1>
        
        <div className="container login-page">
          <section>
            <h1>Figure out who took the sensitive data</h1>
            <p>Login into User's account for their file usage</p>
            <div className="login-type">
              <button 
                className={`btn ${loginType == 'login' ? 'selected' : ''}`}
                onClick={()=>setLoginType('login')}>
                  Login
              </button>
            </div>
            <form className="add-form login">
                  <div className="form-control">
                      <label>Email *</label>
                      <input onChange={(e)=>{handleCreds(e)}} type="text" name="email" placeholder="Enter your email" />
                  </div>
                  <div className="form-control">
                      <label>Password *</label>
                      <input onChange={(e)=>{handleCreds(e)}} type="password" name="password" placeholder="Enter your password" />
                  </div>
                    <button onClick={(e)=>{handleLogin(e)}} className="active btn btn-block">Login</button>
                  
              </form>
          </section>
        </div>
      </>
    )
  }
  
  export default LoginPage
  