import './Post.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function OtherUserProfile(props) {
    const { author, datePosted, text } = props.passedData;
    const [ linkUsername, setLinkUsername ] = useState(null);
    const [ linkName, setLinkName ] = useState(null);

    const navigate = useNavigate();

    useEffect(() => { 
        setLinkName(<span className='post-author-name' style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${author.username}`)}>{author.name}</span>);
        setLinkUsername(<span className='post-author-username' style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${author.username}`)}>@{author.username}</span>);
    }, [author.name, author.username, navigate])

    
    return (
        <div className='post-container'>
            <div className='post-header'>
                <div className='post-author'>
                    {linkName}
                    {linkUsername}
                </div>
                <span className='post-date'>{datePosted}</span>
            </div>
            <div className='post-content'>
                <p>{text}</p>
            </div>
        </div>
    );
}