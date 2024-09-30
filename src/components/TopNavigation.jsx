import {
    FaSearch,
    FaHashtag,
    FaRegBell,
    FaUserCircle,
    FaMoon,
    FaSun,
    FaBars,
    FaIndustry,
  } from 'react-icons/fa';
  import useDarkMode from '../hooks/useDarkMode';
  import { useState } from 'react';
  import NavLinks from './Navbar/NavLinks';
  
  const TopNavigation = ({ onreportClick, onHashtagClick, onBellIconClick,dropDwononclik }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
      console.log('toggleDropdown');
    };
    return (
      <div className='top-navigation fixed top-0 left-0 w-full z-50'>
        <HashtagIcon onClick={onHashtagClick} />
        <Title />
        
        <NavLinks />
        <Machinepicker onClick={onreportClick} />
        
        {/* <Search /> */}
        <BellIcon onClick={onBellIconClick}/>
        <ThemeIcon />
        <UserCircle onClick={toggleDropdown}/>
        {isDropdownOpen && (
        <div id="dropdownAvatar" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>Bonnie Green</div>
            <div class="font-medium truncate">name@flowbite.com</div>
          </div>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
            </li>
          </ul>
          <div class="py-2">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
          </div>
      </div>
        )}
        

{/* <!-- Dropdown menu --> */}
      
      </div>
    );
  };
  
  const ThemeIcon = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
      <span onClick={handleMode}>
        {darkTheme ? (
          <FaSun size='24' className='top-navigation-icon' />
        ) : (
          <FaMoon size='24' className='top-navigation-icon' />
        )}
      </span>
    );
  };
  
  const Search = () => (
    <div className='search'>
      <input className='search-input' type='text' placeholder='Search...' />
      <FaSearch size='18' className='text-secondary my-auto' />
    </div>
  );
  const BellIcon = ({ onClick }) => <FaRegBell size='24' className='top-navigation-icon' onClick={onClick}/>;
  const UserCircle = ({onClick}) => <FaUserCircle size='24' className='top-navigation-icon' onClick={onClick}/>;
  const Machinepicker = ({onClick}) => <FaIndustry size='24' className='top-navigation-icon' onClick={onClick}/>;
  const HashtagIcon = ({ onClick }) => (
    <FaBars size='20' className='title-hashtag' onClick={onClick} />
  );
  const Title = () => (
    <h5 className='px-3 title-text sm:text-lg md:text-xl lg:text-xl'>
      <span className='hidden sm:inline'>MACHINE MANAGEMENT SYSTEM</span>
      <span className='sm:hidden'>MMS</span>
    </h5>
  );
  
  
  export default TopNavigation;
  