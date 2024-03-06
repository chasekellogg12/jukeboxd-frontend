import React, { useEffect, useState } from 'react';
import logo from '../assets/font/logo512.png';
//import './TopFour.css';

const TopFour = (props) => {
    // props is a list of song_ids. With this list of song IDs, make a GET request to tracks in Spotify's API. Then go thru the response and display the album art for each.

    const { passedData } = props;

    return (
        <div className='top-four-wall-container flex justify-evenly mt-1'>
            {passedData.map((song, index) => ( // for every track, get it's album cover art image 
                <div key={index} className='track w-1/5'>
                    {song.albumCoverArt === 'None' ? 
                        <img className='border-4 border-slate-400 hover:border-b-green bg-red' src={logo} alt='track cover art' style={{borderRadius: '8px'}}></img> :
                        <img className='border-4 border-slate-400 hover:border-b-green' src={song.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                    } 
                </div>
            ))}
        </div>
    )
}
export default TopFour;