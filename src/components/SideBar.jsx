import { useState } from 'react';
import { BsPlus, BsNewspaper, BsFillGearFill, BsFillLightningFill, BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';

const SideBar = ({ formInsert, reportMachineclicked }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`fixed top-18 left-0 h-screen ${isOpen ? 'w-16' : 'w-0'} flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-all duration-300`}>
      {isOpen && (
        <>
          <SideBarIcon icon={<FaFire size="28" />} text="Home" />
          <Divider />
          <SideBarIcon icon={<BsFillGearFill size="32" />} text="Machine Performance" onClick={reportMachineclicked} />
          <SideBarIcon icon={<BsNewspaper size="32" />} text="Error Handling" onClick={formInsert} />
          <SideBarIcon id="dropdownLeftEndButton" onClick={toggleDropdown} icon={<BsFillLightningFill size="32" />} text="Processing Milk Machine" />
          {isDropdownOpen && (
            // <div id="dropdownLeftEnd" className="z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            //   <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLeftEndButton">
            //     <li>
            //       <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
            //     </li>
            //     <li>
            //       <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
            //     </li>
            //     <li>
            //       <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
            //     </li>
            //     <li>
            //       <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
            //     </li>
            //   </ul>
            // </div>
            <div id="dropdownRight" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRightButton">
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                </li>
              </ul>
          </div>
            
          )}
          <Divider />
          <SideBarIcon icon={<IoLogOut size="22" />} text="Log Out" />
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
      <button
        className={`absolute ${isOpen ? 'right-[-24px]' : 'right-4'} top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full`}
        onClick={toggleSidebar}
      >
        {isOpen ? <BsFillCaretLeftFill size="10" /> : <BsFillCaretRightFill size="10" />}
      </button>
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
