import { useState } from 'react'
import '../styles/Update_Profile.css';
import { NavigationBar } from './NavigationBar';

export const UpdateProfile = () => {

    const [newPass,setPass] = useState('');
    const [newEmail, setEmail] = useState('');
    const [reTyped,setRetyped] = useState('');
    const [oldPass,setOld] = useState('');
    const[enteredCode, setCode] = useState('');
    const [showChange,setShow] = useState(false);
    const [ButtonText, setText] = useState('Send Code');
    const [HideButtons, setHide] = useState(true);
    const [VerifyText, setVerify] = useState('');
    const [ConfirmEmail, setConfirm] = useState(false);

    const[newCode, setNewCode] = useState('');

    const[ChangeType,SetChange] = useState('');

    const userID = localStorage.getItem('userid');
    console.log(userID);
    console.log(ButtonText);

    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const SendEmail = async () => {
        
    
        // Construct the payload for the registration API
        const PasswordChangeRequest = {
            OldPass: '',
            NewPass: '',
            UserID: userID  
        };
    
        try {
          // Make a POST request to the backend API
          const response = await fetch(`${baseUrl}/api/passwordchange/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(PasswordChangeRequest),
          });
    
          const data = await response.json();
          if (response.ok) {
            setText('Resend Code');
            alert("Verification email sent successfully!");
           
          } else {
            alert(data.message || 'Something went wrong.');
          
          }
        } catch (error) {
          alert('Error sending verification email: ' );
         
        }
      };

    const confirmCode = async() =>{
        const VerificationDto = {
          Id: userID,
          VerificationCode: enteredCode
        }

        try {
          // Make a POST request to the backend API
          const response = await fetch(`${baseUrl}/api/passwordchange/verify-code`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(VerificationDto),
          });
    
          const data = await response.json();
          if (response.ok) {
            setText('Resend Code');
            setShow(true);
            alert("Verified successfully and you can update your password as below!");
           
          } else {
            alert(data.message || 'Something went wrong.');
          
          }
        } catch (error) {
          alert('Error of Verification' );
         
        }

    }

    const saveNewPass = async () => {
      if (newPass === '' || reTyped === '' || oldPass === '') {
        alert("Please fill information in all fields.");
        return;
      }
    
      const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPass);
    
      if (newPass !== reTyped) {
        alert("Passwords do not match!");
        return;
      }
    
      if (!validPass) {
        alert("Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
        return;
      }
    
      const PasswordChange = {
        OldPass: oldPass,
        NewPass: newPass,
        UserID: userID
      };
    
      try {
        const response = await fetch(`${baseUrl}/api/passwordchange/password-change`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(PasswordChange),
        });
    
        const data = await response.json();
        if (response.ok) {
          alert("Password changed successfully!");
        } else {
          alert(data.message || 'Something went wrong.');
        }
      } catch (error) {
        alert('Error changing password!');
      }
    };


  const handleChangeButtons = (changeType: string) =>{
    if(changeType === 'password'){
      SetChange('password');
      setVerify('Enter the code sent to your email to confirm Password Change');
      setHide(false);

    }
    else if (changeType === 'email'){
      SetChange('email');
      setVerify('Enter the code sent to your email to confirm Email Update');
      setHide(false);

    }

  }


  const saveNewEmail = async() => {
      if(newEmail === ''){
        alert("Please enter your new E-mail to proceed.");
      }
      else{

        const EmailUpdateModel = {
          NewEmail: newEmail,
          Id: userID,
          VerificationCode: newCode
        }


        try {
          const response = await fetch(`${baseUrl}/api/updateemail/save-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(EmailUpdateModel),
          });
      
          const data = await response.json();
          if (response.ok) {
            setConfirm(true);
            alert("Email updated successfully!");
          } else {
            alert(data.message || 'Something went wrong.');
          }
        } catch (error) {
          alert('Error changing Email!');
        }
      }
  }


  const handleClose = () =>{
      setHide(true);
      SetChange('');
  }

  const SendToNewEmail = async() => {

    if(newEmail === ''){
      alert("Please enter your new E-mail to proceed.");
    }
    else{
      const EmailUpdateModel = {
        NewEmail: newEmail,
        Id: userID,
        VerificationCode: ''
      }
      try {
        const response = await fetch(`${baseUrl}/api/updateemail/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(EmailUpdateModel),
        });
    
        const data = await response.json();
        if (response.ok) {
          setConfirm(true);
          
          alert("Sent Verification Code successfully!");
        } else {
          alert(data.message || 'Something went wrong.');
        }
      } catch (error) {
        alert('Error changing password!');
      }
    }
    
  }


    return (

      <div>
        <NavigationBar/>
        {
          HideButtons && (
            <div className='UpdaeInfo'>
            <button onClick={()=>handleChangeButtons('password')}>
              <span style={{marginRight:'5px'}}>
              Update Password 
              </span>  
              <i className="fa-solid fa-lock"></i>
              </button>
            <button onClick={()=>handleChangeButtons('email')}> 
            <span style={{marginRight:'5px'}}>
              Update your email
              </span>

              <i className="fa-solid fa-envelope"></i>
              </button>
        </div>
          )

        }
       

    <div className='PasswordFrom'>


    {
      ChangeType !== '' &&  (
        <div className='verifyEmail'>
          <button onClick={()=>handleClose()} className='close-button'>
          <i className="fa-solid fa-rectangle-xmark"></i>
          </button>
      
        <h4>{VerifyText}</h4>
        <button onClick={()=> SendEmail()}>{ButtonText}</button>
        <input placeholder='Enter the verification code' onChange={(e) => setCode(e.target.value)}></input>
        <div>
        <button onClick={()=> confirmCode()}>Confirm</button>
          </div>
       

    </div>

      )
    }
            
    

    {
      showChange && ChangeType === 'password' && (
        <div className='ChangePassword'>
      <div className='PasswordInput'>
        <div>
        <span>Enter your old password: </span>
        <input type='password' className='Passwordinput' placeholder='Your old password'  onChange={ e => setOld(e.target.value)}/>
        </div>
        

        <div>
          <span>Enter your new password: </span>
          <input type='password' className='Passwordinput' placeholder='Your new password' onChange={ e => setPass(e.target.value)}/>
        </div>

        <div>
          <span>Retype your new password: </span>
          <input type='password'  className='Passwordinput' placeholder='Retype your new password'  onChange={ e => setRetyped(e.target.value)}/>
        </div>

        
      </div>
      <button onClick={()=>saveNewPass()} className='changePassButton' >Change Password</button>
    </div>

      )
    }


{
      showChange && ChangeType === 'email' && (
        <div className='ChangeEmail'>
      <div className='PasswordInput'>
        

        <div>
          <span>Enter your new E-mail: </span>
          <input type='email' className='Emailinput' placeholder='Your new E-mail' onChange={ e => setEmail(e.target.value)}/>
        </div>

        
      </div>
      <button onClick={()=>SendToNewEmail()} className='changePassButton' >Update E-mail</button>
    </div>

      )
    }
    {
      ConfirmEmail && (
        <div>
          <span>Please enter the verification code sent to your new E-mail</span>
          <input placeholder='Enter verification code' onChange={(e) => setNewCode(e.target.value)}></input>
          < button onClick={()=>saveNewEmail()}>Confirm E-mail Update</button>
        </div>
      )
    }



    </div>

          </div>
          
        );
      };
      
