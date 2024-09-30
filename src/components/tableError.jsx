import TopNavigation from './TopNavigation';
import { BsPlusCircleFill } from 'react-icons/bs';
// import { useState } from 'react';

const ContentTable = ({ onHashtagClick }) => {
  return (
    <div className='content-container'>
      <TopNavigation onHashtagClick={onHashtagClick}/>
      <table class="table-auto">
        <thead>
            <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Year</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
            </tr>
            <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
            </tr>
            <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
            </tr>
        </tbody>
        </table>
      <BottomBar />
    </div>
  );
};

const containerTextx = () => {

};

const BottomBar = () => (
  <div className='bottom-bar'>
    <PlusIcon />
    <input type='text' placeholder='Enter message...' className='bottom-bar-input' />
  </div>
);

const Post = ({ name, timestamp, text }) => {

  const seed = Math.round(Math.random() * 100);
  return (
    <div className={'post'}>
      <div className='avatar-wrapper'>
        <img src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`} alt='' className='avatar' />
      </div>

      <div className='post-content'>
        <p className='post-owner'>
          {name}
          <small className='timestamp'>{timestamp}</small>
        </p>
        <p className='post-text'>{text}</p>
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <BsPlusCircleFill
    size='22'
    className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
  />
);

export default ContentTable;
