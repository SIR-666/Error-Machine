import { useState } from 'react';
import { BsPlus, BsNewspaper, BsFillGearFill, BsFillLightningFill, BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";

const SideBar = ({ formInsert, reportMachineclicked, onchannelbarOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  

  const handleNavigation = (link) => {
    navigate(link);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`sidebar-theme top-16 ${isOpen ? 'w-16' : 'w-0'} flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-all duration-300`}>
      {isOpen && (
        <>
          <SideBarIcon icon={<FaFire size="28" />} text="Home" onClick={() => handleNavigation('/home')}/>
          <Divider />
          <SideBarIcon 
          icon={<BsFillGearFill size="32" />} 
          text="Machine Performance" 
          // onClick={reportMachineclicked} 
          onClick={onchannelbarOpen}
          />
          {/* <SideBarIcon icon={<BsNewspaper size="32" />} text="Error Handling" onClick={formInsert} /> */}
          <SideBarIcon 
          icon={<BsNewspaper size="32" />} 
          text="Error Handling" 
          // onClick={formInsert}
          onClick={() => handleNavigation('/login')}
          />
          <SideBarIcon id="dropdownLeftEndButton" onClick={toggleDropdown} icon={<BsFillLightningFill size="32" />} text="Processing Milk Machine" />
          
          <Divider />
          <SideBarIcon 
          icon={<IoLogOut size="22" />} 
          text="Log Out" 
          onClick={() => handleNavigation('/logout')}
          />
          {/* <button 
            id="dropdownLeftEndButton" 
            onClick={toggleDropdown} 
            className="me-3 mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
            type="button">
            <svg className="w-2.5 h-2.5 me-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
            </svg>
            Dropdown
          </button> */}
          
        </>
      )}
      {/* <button
        className={`absolute ${isOpen ? 'right-[-24px]' : 'right-4'} top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full`}
        onClick={toggleSidebar}
      >
        {isOpen ? <BsFillCaretLeftFill size="10" /> : <BsFillCaretRightFill size="10" />}
      </button> */}
    </div>
  );
};

const SideBarIcon = ({ icon, text, onClick }) => (
  <div className="sidebar-icon group" onClick={onClick}>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
