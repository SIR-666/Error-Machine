import {
    FaSearch,
    FaHashtag,
    FaRegBell,
    FaUserCircle,
    FaMoon,
    FaSun,
    FaBars,
    FaIndustry,
    FaClock, 
  } from 'react-icons/fa';
  import useDarkMode from '../../hooks/useDarkMode';
  import { useState } from 'react';
  
  const TopNavigation_inputMenu = ({ onreportClick, onHashtagClick, onBellIconClick,dropDwononclik }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
      console.log('toggleDropdown');
    };
    return (
      // <div className='top-navigation fixed top-0 left-0 w-full z-50'>
      <div className='top-navigation fixed top-0 left-0 w-full z-50'>
        <HashtagIcon onClick={onHashtagClick} />
        <Title />
        
        
        <ThemeIcon />
        <Divider/>
        <UserCircle onClick={toggleDropdown}/>
       
        

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
  
  const Divider = () => <hr className="topbar-hr" />;

  const Search = () => (
    <div className='search'>
      <input className='search-input' type='text' placeholder='Search...' />
      <FaSearch size='18' className='text-secondary my-auto' />
    </div>
  );
  const ClockIcon = ({ onClick }) => <FaClock  size='24' className='top-navigation-icon' onClick={onClick}/>;
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
  
  
  export default TopNavigation_inputMenu;
  