import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    // Check for valid token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (token && Date.now() < tokenExpiration) {
            // Token exists and is not expired, redirect to InputForm
            navigate('/inputMenu');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Example login logic - replace this with your actual authentication logic
        if (username === 'admin' && password === 'password') { // Replace with actual conditions
            // Simulate a token - in real world case, you would get this from an API response
            const token = 'your_token_here'; // This would actually come from an API
            const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds
            
            // Store the token and its expiration time in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationTime);
            
            // Redirect user to the '/inputMenu' route upon successful login
            navigate('/inputMenu');
        } else {
            // Display error message if login failed
            setErrorMessage('Invalid username or password. Please try again.');
        }
    };

    return (
        // Render your login form here
        <div className="flex w-full h-screen">
            <div className="w-full flex items-center justify-center lg:w-1/2">
                <form onSubmit={handleSubmit} className="bg-slate-100 px-10 py-20 rounded-3xl border-2 border-gray-100 shadow-md">
                    <h1 className="text-5xl font-semibold">Welcome Back!</h1>
                    <p className="font-medium text-lg text-gray-500 mt-4">Please enter your credentials</p>
                    
                    {errorMessage && (
                        <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mt-8">
                        <div>
                            <label className="text-lg font-medium">Username</label>
                            <input
                                type="text"
                                className="w-full border-2 bg-white border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-lg font-medium">Password</label>
                            <input
                                type="password"
                                className="w-full border-2 bg-white border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-8 flex flex-col gap-y-4">
                            <button type="submit" className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-400 text-white text-lg font-bold">
                                Log In
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-100">
                <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin"></div>
                <div className="w-full h-1/2 absolute bg-white/10 bottom-0 backdrop-blur-lg animate-pulse"></div>
            </div>
        </div>
    );
};

export default LogIn;
