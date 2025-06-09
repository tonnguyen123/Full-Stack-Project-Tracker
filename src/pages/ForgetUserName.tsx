import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgetUserName = () => {
    const navigate = useNavigate();
    const [YourEmail,setEmail] = useState('');
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const sendUserName = async() =>{
        const User = {
            Email: YourEmail
        }
        try {
            const response = await fetch(`${baseUrl}/api/SendUserName`,{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(User)
            });

            const result = await response.json();
            if(response.ok){
                alert("Email is sent. Check your email for your user name");  // success
                navigate('/');
            }
            else{
                alert(result); 
                console.log('Error sending email')
            }

        }
        catch{
            alert("There is some error sending email.")
        }

    }
  return (
    <div>
        <h3>Please enter your Email to get the user name:</h3>
        <input placeholder='Enter your email to get your user name' onChange={(e)=>setEmail(e.target.value)} style={{margin: '10px'}}>
        </input>
        <div>
        <button onClick={sendUserName}>Submit</button>
        </div>
        
    </div>
  )
}
