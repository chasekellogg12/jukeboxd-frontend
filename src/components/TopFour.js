import { set } from 'date-fns';
import React, { useEffect, useState } from 'react';
import logo from '../assets/font/logo512.png';

import sadMascot1 from "../assets/font/sadMascot24.png";
import sadMascot2 from "../assets/font/sadMascot21.png";
import sadMascot3 from "../assets/font/sadMascot22.png";
import sadMascot4 from "../assets/font/sadMascot23.png";
//import './TopFour.css';


const TopFour = (props) => {
    // props is a list of song_ids. With this list of song IDs, make a GET request to tracks in Spotify's API. Then go thru the response and display the album art for each.

    // just give top four wall logged in user info AND thisUserInfo. if they equal, display the edit buttons

    const { passedData, loggedInUser, thisUser, openSearch, closeSearch } = props;
    const sadMascots = [sadMascot1, sadMascot2, sadMascot3, sadMascot4]

    return (
        <div className='flex mt-1 top-four-wall-container justify-evenly'>
            {passedData.map((song, index) => ( // for every track, get it's album cover art image 
                <div key={index} className='relative w-1/5 border-4 group rounded-xl track border-dark-purple hover:border-orange-400'>
                    <img className='' src={song.albumCoverArt === 'None' ? sadMascots[index] : song.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                    
                    <div className='absolute inset-0 flex-col items-center justify-center hidden p-1 rounded-lg opacity-75 group-hover:flex bg-h-grey stroke-hov-blue'></div>
                    <div className='absolute inset-0 flex-col items-center justify-center hidden text-center align-middle group-hover:flex text-clip text-balance'>
                        <span className='abrilfatface'>{song.name === 'None' && song.artist === 'None' ? 'There is nothing here yet.' : song.name}</span>
                        <span>{song.name === 'None' && song.artist === 'None' ? '' : song.artist}</span>
                    </div>
                    {loggedInUser && loggedInUser.username === thisUser.username && <svg onClick={() => openSearch(index)} className='absolute items-center justify-center hidden p-1 rounded-lg cursor-pointer top-1 right-1 group-hover:flex bg-c-grey stroke-hov-blue'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C6AEF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>}
                </div>
            ))}
        </div>
    )
}
export default TopFour;