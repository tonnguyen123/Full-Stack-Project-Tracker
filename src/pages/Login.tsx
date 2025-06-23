import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Login component for user authentication
export const Login = () => {
    // State variables for storing user input
    const [typedUser, setUser] = useState('');
    const [typedPass, setPass] = useState('');
    const navigate = useNavigate();

    // Base URL for backend API, pulled from environment variable
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    // Function to verify user login by sending credentials to the backend
    const verifyUserLogin = async () => {
        const UserLogin = {
            Username: typedUser,
            Password: typedPass
        };

        

        try {
            // Send POST request to login endpoint
            const response = await fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserLogin),
            });

            const result = await response.json();

            if (response.ok) {
                // Store login details in localStorage for session handling
                localStorage.setItem("token", result.token);
                localStorage.setItem("userid", result.userId);
                localStorage.setItem("yourUserName", result.userName);

                // Navigate to project dashboard page after successful login
                navigate(`/projects/${result.token}`);
            } else {
                // Show error message from backend
                alert(result.message);
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Login failed:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            <h1>Welcome to Ton's Project Tracker</h1>
            <div className='userInfo'>
                {/* Username input field */}
                <div className='userName'>
                    <p>User name:</p>
                    <input
                        type='text'
                        placeholder='Enter your username'
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>

                {/* Password input field */}
                <div className='pass'>
                    <p>Password:</p>
                    <input
                        type='password'
                        placeholder='Enter your password'
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>

                {/* Sign In button triggers login verification */}
                <button onClick={verifyUserLogin} style={{ margin: '10px' }}>
                    Sign In
                </button>

                {/* Links for additional user account options */}
                <div>
                    <Link to="/register">Register your account</Link>
                </div>
                <div>
                    <Link to="/forgotUsername">Forgot your Username?</Link>
                </div>
                <div>
                    <Link to="/resetPass">Forgot your password?</Link>
                </div>
            </div>
        </div>
    );
}
