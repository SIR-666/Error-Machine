import React, { useState, useRef, useEffect } from 'react';
import SideBar from './components/SideBar';
import ContentContainer from './components/ContentContainer';
import TopNavigation from './components/TopNavigation';
import InputForm from './components/inputForm';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import ContentContainer_Filling from './components/Filling/ContentContainer';
import ContentContainer_WP25E from './components/WP25E/ContentContainer';
import ContentContainer_WP25C from './components/WP25C/ContentContainer';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState('default');
  const [isFormInsert, setIsFormInsert] = useState('default'); // Renamed for clarity
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className='h-screen '>
      {/* <Navbar/> */}
      
      <Router>
        <TopNavigation
              onHashtagClick={toggleSidebar}
              onBellIconClick={handleBellIconClick}
              onreportClick={handleReportClick}
            />

            <div ref={sidebarRef}>
              {isSidebarVisible && <SideBar 
              formInsert={handleSidebarAction} 
              reportMachineclicked ={handleSidebarAction2}
              />}
            </div>

        <Routes>
          <Route exact path="/packB" element={
            <div className="app-container mt-16">

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer activeMenu={activeMenu} />}
              {isFormInsert === 'inputFormerror' && <InputForm />}
            </div>
          </div>

          } />

          <Route exact path="/fillB" element={
            <div className="app-container mt-16">

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_Filling activeMenu={activeMenu} />}
              {isFormInsert === 'inputFormerror' && <InputForm />}
            </div>
          </div>

          } />

          <Route exact path="/packC" element={
            <div className="app-container mt-16">

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_WP25C activeMenu={activeMenu} />}
              {isFormInsert === 'inputFormerror' && <InputForm />}
            </div>
          </div>

          } />

          <Route exact path="/packE" element={
            <div className="app-container mt-16">

            <div ref={contentRef}>
              {isFormInsert === 'default' && <ContentContainer_WP25E activeMenu={activeMenu} />}
              {isFormInsert === 'inputFormerror' && <InputForm />}
            </div>
          </div>

          } />
          {/* <Route path="/error" element={<ContentContainer activeMenu={activeMenu} />} /> */}
        </Routes>

      
      </Router>
      
      
    </section>
    
  );
}

export default App;
