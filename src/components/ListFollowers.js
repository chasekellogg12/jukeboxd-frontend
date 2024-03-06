import logo from '../assets/font/logo512.png';
import { useNavigate } from 'react-router-dom';

const ListFollowers = (props) => {
    // when this page is opened, make a GET request to get a list of all the Users
    const { passedData } = props;
    const navigate = useNavigate();

    const handleSelect = (username) => {
        navigate(`/profile/${username}`);
        navigate(0);
    }

    return (
        <div>
            {props.isOpen && (
            <div onClick={props.onClose} className='fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-gray-700 bg-opacity-50 text-h-grey'>
                <div onClick={(e) => e.stopPropagation()} className='z-10 flex flex-col items-center w-1/3 p-6 space-y-3 border rounded-lg shadow-lg bg-c-grey'>

                    <button onClick={props.onClose} className='text-sm'>Close</button>
                    <div className='overflow-auto max-h-96'>
                        {passedData.map(user => ( // for every track, get it's album cover art image 
                            <div key={user.username} className='mb-2.5 ml-1'>
                                <button className='flex items-center space-x-3 text-sm rounded-md hover:bg-black' onClick={() => handleSelect(user.username)}>
                                    <img className='w-1/12 rounded-full ring-1 ring-orange-400'src={logo} alt='profile'></img>
                                    <div className='flex flex-col items-start justify-start'>
                                        <div className='flex items-center space-x-1 title'>
                                            <div className='text-white abrilfatface'>{user.name}</div>
                                        </div>
                                        <div className='text-sm italic'>@{user.username}</div>
                                    </div>

                                    
                                    {/* {track.name} {track.album && track.album.release_date.slice(0, 4) ? track.album.release_date.slice(0, 4) : ''} {track.artists  ? track.artists[0].name : ''} */}
                                </button>
                            </div>
                    ))}
                    </div>
                </div>
            </div>
            )}
        </div>

        // <div className='flex flex-col items-center list-of-users text-h-grey'> 
        //     {passedData.map(user => ( // for every user in the list of users, put its name in its own div
        //         <div className='flex items-center author-container mb-2.5' key={user.username}>
        //             {/* <div className='avatar'></div> */}
        //                 <div className='mr-2 rounded-full w-7 h-7 ring ring-offset-base-100 ring-offset-2'>
        //                     <img
        //                         src={logo}
        //                         alt='Profile pic'
        //                     />
        //                 </div>
        //             <span className='text-white post-author-name' style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${user.username}`)}>{user.name}</span>
        //         </div>
        //     ))}
        // </div>

        // <div className='list-of-followers'> 
        //     {passedData.map(user => ( // for every user in the list of users, put its name in its own div
        //         <div key={user.username}>{user.name}</div>
        //     ))}
        // </div>
    )
}
export default ListFollowers;