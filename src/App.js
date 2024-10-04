import React, { useState, useRef, useEffect } from 'react';
import SideBar from './components/SideBar';
import ContentContainer from './components/ContentContainer';
import TopNavigation from './components/TopNavigation';
import InputForm from './components/inputMenu/inputForm';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import ContentContainer_Filling from './components/Filling/ContentContainer';
import ContentContainer_WP25E from './components/WP25E/ContentContainer';
import ContentContainer_WP25C from './components/WP25C/ContentContainer';
import TopNavigation_inputMenu from './components/inputMenu/TopNavigation';
import ChannelBar from './components/ChannelBar'; 
import LogIn from './components/Log_In/Log-In';
import Logout from './components/logout/logout';
import HomeMenu from './components/home/home_menu';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isChanelbarVisible, setIsChanelbarVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState('default');
  const [isFormInsert, setIsFormInsert] = useState('default'); // Renamed for clarity
  const sidebarRef = useRef(null);
  const chanelbarRef = useRef(null);
  const contentRef = useRef(null);
  const [selectedRoute, setSelectedRoute] = useState('default');
  const token = localStorage.getItem('token');

  
  const toggleChannelbar = () => {
    setIsChanelbarVisible(prev => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const handleRouteChange = (param) => {
    setActiveMenu(param);
    console.log(`Route changed to: ${param}`); // For debugging
    // You can perform any other actions here, like logging or navigating
  };

  const handleSidebarAction = () => {
    setIsFormInsert('inputFormerror'); // Update state to show InputForm
    setActiveMenu(''); // Optionally reset active menu
  };

  const handleSidebarAction2 = () => {
    setIsFormInsert('default'); // Update state to show InputForm
    setActiveMenu('default'); // Optionally reset active menu
  };

  const handleBellIconClick = () => {
    setActiveMenu('notifications');
  };

  const handleReportClick = () => {
    setActiveMenu('default');
  };
  const handleClickOutside = (event) => {
    if (
      sidebarRef.current && !sidebarRef.current.contains(event.target) &&
      contentRef.current && !contentRef.current.contains(event.target)
    ) {
      setIsSidebarVisible(false);
    }

    if(
      chanelbarRef.current && !chanelbarRef.current.contains(event.target) &&
      contentRef.current && !contentRef.current.contains(event.target)
    )
    {
      setIsChanelbarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className='h-screen'>
      {/* <Navbar/> */}
      
      <Router>
        

            <div className='flex' ref={sidebarRef}>
              {isSidebarVisible && !token && <SideBar 
              formInsert={handleSidebarAction} 
              onchannelbarOpen = {toggleChannelbar}
              reportMachineclicked ={handleSidebarAction2}
              />
              }

              {isChanelbarVisible && isSidebarVisible  && <ChannelBar onRouteChange={handleRouteChange}/>
              }

              
              
            </div>

        <Routes>
        
        <Route exact path="/home" element={
          <div className="mt-16">
            <TopNavigation_inputMenu
                onHashtagClick={toggleSidebar}
                onBellIconClick={handleBellIconClick}
                onreportClick={handleReportClick}
              />
             <HomeMenu/>
            
          </div>

          } />

          <Route exact path="/packB" element={
          <div className="mt-16">
          <TopNavigation_inputMenu
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer activeMenu={activeMenu} />}
              {/* {isFormInsert === 'inputFormerror' && <InputForm />} */}
            </div>
          </div>

          } />

          <Route exact path="/fillB" element={
            <div className="app-container mt-16">
            <TopNavigation_inputMenu
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />
            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_Filling activeMenu={activeMenu} />}
              {isFormInsert === 'inputFormerror' && <InputForm />}
            </div>
          </div>

          } />

          <Route exact path="/packC" element={
            <div className="app-container mt-16">
            <TopNavigation_inputMenu
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_WP25C activeMenu={activeMenu} />}
              {/* {isFormInsert === 'inputFormerror' && <InputForm />} */}
            </div>
          </div>

          } />

          <Route exact path="/packE" element={
            <div className="app-container mt-16">
            <TopNavigation_inputMenu
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />
            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_WP25E activeMenu={activeMenu} />}
              {/* {isFormInsert === 'inputFormerror' && <InputForm />} */}
            </div>
          </div>

          } />

          {/* Redirect to InputForm if already logged in */}
          
          <Route path="/login" element={
                    token ? (
                        // If the token exists, navigate to InputForm
                        <Navigate to="/inputMenu" replace />
                    ) : (
                        // Otherwise, show the LogIn component
                        <div className="app-container">
                            <LogIn />
                        </div>
                    )
                } />

          <Route exact path="/inputMenu" element={
            <div className="app-container mt-16">
            <TopNavigation_inputMenu
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />
            {/* <LogIn/> */}
            <InputForm />

          </div>

          } />

          <Route exact path="/Logout" element={
            <Logout/>

          } />
          {/* <Route path="/error" element={<ContentContainer activeMenu={activeMenu} />} /> */}
        </Routes>

      
      </Router>
      
      
    </section>
    
  );
}

export default App;
