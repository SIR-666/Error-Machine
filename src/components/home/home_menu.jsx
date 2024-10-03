import React, { useEffect, useState } from 'react';

const HomeMenu = () => {
   
    return (
        
        // Render your login form here
        <div className="flex w-full h-screen">
            
            <div className="hidden relative lg:flex h-full w-screen items-center justify-center bg-gray-100">
                <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin"></div>
                <div className="w-full h-1/2 absolute bg-white/10 bottom-0 backdrop-blur-lg animate-pulse"></div>
            </div>
        </div>
    );
};

export default HomeMenu;
