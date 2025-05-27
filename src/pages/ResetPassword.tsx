import { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleSubmit = async () => {
        const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        if(!validPass){
            alert("Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character. ");
            return;
          }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const PasswordResetModel = {
                Token: token,
                NewPassword: password
            }
            const response = await fetch('http://localhost:5041/api/resetpassword/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(PasswordResetModel),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password reset successfully');
                navigate('/');

            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error resetting password.');
        }
    };

    return (
        <div>
            <h3>Reset your password</h3>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            </div>
            
            {error && <p>{error}</p>}
            <button onClick={handleSubmit} style={{marginTop:'10px'}}>Reset Password</button>
        </div>
    );
};

export default ResetPassword;
