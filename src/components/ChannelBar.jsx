import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsHash } from 'react-icons/bs';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';

// Sample data structure
const LineA = [
    {
        header: 'Line B',
        subSelections: [
            { 
                name: 'Filling B', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/fillB', param: 'default' },
                    { name: '- Realtime Performance', route: '/fillB', param: 'notifications' },
                ]
            },
            { 
                name: 'Packing B', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/packB', param: 'default' },
                    { name: '- Realtime Performance', route: '/packB', param: 'notifications' }
                ]
            }
        ]
    },
    {
        header: 'Line C',
        subSelections: [
            { 
                name: 'Filling C', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/fillC', param: 'default' },
                    { name: '- Realtime Performance', route: '/fillC', param: 'notifications' },
                ]
            },
            { 
                name: 'Packing C', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/packC', param: 'default' },
                    { name: '- Realtime Performance', route: '/packC', param: 'notifications' }
                ]
            }
        ]
    },
    {
        header: 'Line E',
        subSelections: [
            { 
                name: 'Filling E', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/fillE', param: 'default' },
                    { name: '- Realtime Performance', route: '/fillE', param: 'notifications' },
                ]
            },
            { 
                name: 'Packing E', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/packE', param: 'default' },
                    { name: '- Realtime Performance', route: '/packE', param: 'notifications' }
                ]
            },
            { 
                name: 'Helicap', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/packE', param: 'default' },
                    { name: '- Realtime Performance', route: '/packE', param: 'notifications' }
                ]
            },
            { 
                name: 'Robot UHT', 
                subSelections: [
                    { name: '- Report Machine Performance', route: '/packE', param: 'default' },
                    { name: '- Realtime Performance', route: '/packE', param: 'notifications' }
                ]
            },
        ]
    }
];

const ChannelBar = ({ onRouteChange }) => {
    // Initialize all sections to be collapsed (false state)
    const initialExpandedState = Array(LineA.length).fill(false);
    const [expandedSections, setExpandedSections] = useState(initialExpandedState);

    const toggleExpand = (index) => {
        setExpandedSections((prev) => {
            const newExpanded = [...prev];
            newExpanded[index] = !newExpanded[index]; // Toggle the clicked section
            return newExpanded;
        });
    };

    return (
        <div className='channel-bar shadow-lg top-16'>
            <ChannelBlock />
            <div className='channel-container'>
                {LineA.map((item, index) => (
                    <Dropdown 
                        key={index} 
                        header={item.header} 
                        selections={item.subSelections} 
                        isExpanded={expandedSections[index]} // Pass expanded state
                        onToggle={() => toggleExpand(index)} // Pass toggle function
                        onRouteChange={onRouteChange} // Pass it here
                    />
                ))}
            </div>
        </div>
    );
};

const Dropdown = ({ header, selections, isExpanded, onToggle, onRouteChange }) => {
    const [expandedSubSections, setExpandedSubSections] = useState(Array(selections.length).fill(false));

    const toggleSubExpand = (index) => {
        setExpandedSubSections((prev) => {
            const newExpanded = [...prev];
            newExpanded[index] = !newExpanded[index]; // Toggle the clicked sub-section
            return newExpanded;
        });
    };

    return (
      <div className='dropdown'>
      {/* Dropdown Header */}
      <div onClick={onToggle} className='dropdown-header'>
          <ChevronIcon expanded={isExpanded} />
          <h5 className={isExpanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'}>
              {header}
          </h5>
          <FaPlus size='10' className='text-accent text-opacity-80 my-auto ml-auto' />
      </div>

      {/* Render Sub-selections */}
      {isExpanded && selections.map((selection, index) => (
          <div key={index}>
              <div 
                  onClick={() => toggleSubExpand(index)} 
                  className={`dropdown-subheader ${expandedSubSections[index] ? 'expanded' : ''}`}
              >
                  <ChevronIcon expanded={expandedSubSections[index]} />
                  <h5 className={`dropdown-subheader-text ${expandedSubSections[index] ? 'selected-subheader' : ''}`}>
                      {selection.name}
                  </h5>
              </div>
              {expandedSubSections[index] && selection.subSelections && selection.subSelections.map((subSelection, subIndex) => (
                  <TopicSelection 
                      key={subIndex}
                      selection={subSelection} 
                      onRouteChange={onRouteChange} 
                  />
              ))}
          </div>
      ))}
  </div>
    );
};

const ChevronIcon = ({ expanded }) => {
    const chevClass = 'text-accent text-opacity-80 my-auto mr-1';
    return expanded ? (
        <FaChevronDown size='8' className={chevClass} />
    ) : (
        <FaChevronRight size='8' className={chevClass} />
    );
};

// TopicSelection for each individual selection (leaf node)
const TopicSelection = ({ selection, onRouteChange }) => (
    <Link 
        to={selection.route} 
        className='dropdown-selection' 
        onClick={() => onRouteChange(selection.param)} 
    >
        {/* <BsHash size='8' className='text-gray-400' /> */}
        <h5 className='dropdown-selection-text'>{selection.name}</h5>
    </Link>
);

const ChannelBlock = () => (
    <div className='channel-block'>
        <h5 className='channel-block-text'>Machine Performance</h5>
    </div>
);

export default ChannelBar;
