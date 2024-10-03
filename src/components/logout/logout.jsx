import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            
            // Show the logout success notification
            setNotification('Logout Successful!');

            // Redirect to the login page after a few seconds
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page
                setNotification(''); // Clear notification
            }, 2000); // Adjust the duration as needed
        };

        // Call the handleLogout function immediately
        handleLogout();
    }, [navigate]); // Run the effect only once when the component mounts

    return (
        <div>
            {notification && (
                <div className="notification">
                  {notification}
                </div>
            )}

            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 20px;
                    background-color: rgba(76, 175, 80, 0.9); /* Green color */
                    color: white;
                    border-radius: 5px;
                    animation: fadeIn 0.5s ease, fadeOut 0.5s ease 1.5s forwards;
                }

                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                @keyframes fadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Logout;
