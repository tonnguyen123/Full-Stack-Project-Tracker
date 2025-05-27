import { useState } from 'react';
import '/Project and Study Tracker/project-tracker/src/styles/RegisterStyle.css';
import { useNavigate } from 'react-router-dom';


export const Register = () => {
  // Local state to hold user input
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [message, setMessage] = useState('');
  const [RegisterPressed, setPressed] = useState(false);
  const [hideBackground, setHide] = useState(false);
  const [typedCode, setTyped] = useState('');
  const navigate = useNavigate();

  


  // Function to handle the register button click
  const handleRegister = async () => {
    if(password === '' || username === '' || email === '' || repassword === ''){
      setMessage("Please fill information in all field.");
      return;
    }
    const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    // Check if passwords match
    if (password !== repassword) {
      setMessage("Passwords do not match!");
      return;
    }
   
    if(!validPass){
      setMessage("Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character. ");
      return;
    }
    if(!validEmail){
      setMessage('Invalid email format!');
      return;
    }    
    

    // Construct the payload for the registration API
    const userRegistrationDto = {
      username,
      email,
      password,
      verified: false,  // Assuming unverified at first
      verificationCode: '', // Not needed initially
      
    };

    try {
      // Make a POST request to the backend API
      const response = await fetch('http://localhost:5041/api/register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userRegistrationDto),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Verification email sent successfully!");
        setPressed(true);
        setHide(true);
      } else {
        setMessage(data.message || 'Something went wrong.');
        setDisplay();
      }
    } catch (error) {
      setMessage('Error sending verification email: ' );
      setDisplay();
    }
  };



  const verifyUser = async () => {
    const response = await fetch('http://localhost:5041/api/register/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,  // Assuming `email` is the user's email
        verificationCode: typedCode  // Assuming `verificationCode` is the code entered by the user
      })
    });
    const result = await response.json();
    if (response.ok) {
      alert(result.message);  // success
      navigate('/');

    } else {
      alert(result.message);  // error
    }
  };
  

  const setDisplay = ()=>{
    setPressed(false);
    setHide(false);
  }

  return (
  <div>{
      !hideBackground && (
        <div className='RegisterForm'>
      
      {
        !hideBackground && (
          <div className='userInfo'>
        <div className='userName'>
        <h2>Fill the form below to register your account</h2>
          <p>Your User name:</p>
          <input
            type='text'
            placeholder='Enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className='userEmail'>
          <p>Your email :</p>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='pass'>
          <p>Password:</p>
          <input
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='repass'>
          <p>Re-enter your password:</p>
          <input
            type='password'
            placeholder='Re-enter your password'
            value={repassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>

        <button style={{ margin: '10px' }} onClick={handleRegister}>
          Register
        </button>

        <button style={{ margin: '10px' }} onClick={() => navigate('/')}>
          Back to Login
        </button>

        {message && <p>{message}</p>}
      </div>
        )
      }
    </div> 
        
      )
    }
      
      {RegisterPressed && (
  
    <div className="verificationOverlay">
    <div className='verficationBox'>
      <button className='closeButton' onClick={() => setDisplay()}>X</button>
      <h3 style={{color:'black', paddingTop:'50px'}}>Please check your email and enter the verification code</h3>
      <input className='codeInput' placeholder='Enter your verification code'   onChange={(e) => setTyped(e.target.value)}/>
      <div>
      <button onClick = {verifyUser}>Verify</button>
      </div>
      
    </div>
    </div>
  
)}

      
    </div>

   
  );
};
