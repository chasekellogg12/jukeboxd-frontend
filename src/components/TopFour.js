import React, { useEffect, useState } from 'react';
import logo from '../assets/font/logo512.png';
import sadMascot1 from "../assets/font/mascot.png";
import sadMascot2 from "../assets/font/sadMascot2.png";
import sadMascot3 from "../assets/font/sadMascot3.png";
import sadMascot4 from "../assets/font/sadMascot4.png";
import sadMascot5 from "../assets/font/sadMascot5.png";
//import './TopFour.css';

const TopFour = (props) => {
    // props is a list of song_ids. With this list of song IDs, make a GET request to tracks in Spotify's API. Then go thru the response and display the album art for each.

    const { passedData } = props;
    const sadMascots = [sadMascot2, sadMascot3, sadMascot4, sadMascot5]

    return (
        <div className='flex mt-1 top-four-wall-container justify-evenly'>
            {passedData.map((song, index) => ( // for every track, get it's album cover art image 
                <div key={index} className='w-1/5 track'>
                    {song.albumCoverArt === 'None' ? 
                        <img className='border-4 border-dark-purple hover:border-orange-400' src={sadMascots[index]} alt='track cover art' style={{borderRadius: '8px'}}></img> :
                        <img className='border-4 border-dark-purple hover:border-orange-400' src={song.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                    } 
                </div>
            ))}
        </div>
    )
}
export default TopFour;