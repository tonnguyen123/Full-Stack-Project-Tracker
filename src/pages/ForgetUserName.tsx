import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component that allows users to retrieve their username by entering their email
export const ForgetUserName = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate after form submission

    // State to store user's input email
    const [YourEmail, setEmail] = useState('');

    // Get backend base URL from environment variables
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // Function to send the email to the backend and request the username
    const sendUserName = async () => {
        const User = {
            Email: YourEmail
        };

        try {
            // Send a POST request to the API with the user's email
            const response = await fetch(`${baseUrl}/api/SendUserName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(User)
            });

            const result = await response.json();

            if (response.ok) {
                // Notify user and redirect to homepage if successful
                alert("Email is sent. Check your email for your user name");
                navigate('/');
            } else {
                // Handle failed response from server
                alert(result);
                console.log('Error sending email');
            }

        } catch {
            // Handle network or unexpected errors
            alert("There is some error sending email.");
        }
    };

    return (
        <div>
            <h3>Please enter your Email to get the user name:</h3>

            {/* Email input field */}
            <input
                placeholder='Enter your email to get your user name'
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '10px' }}
            />

            {/* Submit button triggers the email send logic */}
            <div>
                <button onClick={sendUserName}>Submit</button>
            </div>
        </div>
    );
};
