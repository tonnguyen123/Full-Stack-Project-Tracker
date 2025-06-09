import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordRequest = () => {
    const navigate = useNavigate();
    const [YourEmail,setEmail] = useState('');
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const sendResetLink = async() =>{
        const PasswordRequestModel = {
            Email: YourEmail
        }
        try {
            const response = await fetch(`${baseUrl}/api/resetpassword/request-password-reset`,{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(PasswordRequestModel)
            });

            const result = await response.json();
            if(response.ok){
                alert("Email is sent. Check your email for your password reset link");  // success
                navigate('/');
            }
            else{
                alert(result.message || JSON.stringify(result));
            }

        }
        catch{
            alert("There is some error sending email.")
        }

    }
  return (
    <div>
         <h3>Enter your email to get link to reset your password:</h3>
         <div>
            
         </div>
        <input placeholder='' onChange={(e)=>setEmail(e.target.value)} style={{margin: '10px'}}>
        </input>
        <div>
        <button onClick={sendResetLink}>Submit</button>
        </div>
    </div>
   
  )
}
