// do the GET request for all post information in this component. Pass what you get to the post component.

import { useState, useEffect, useCallback, useRef } from 'react';
import PostService from '../services/PostService';
import TrackService from '../services/TrackService';
import Post from './Post';
import { InfiniteMovingCards } from './InfiniteMovingCards';


export default function Rand10(props) { 
    const [listOfPosts, setListOfPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const maxPosts = props.maxPosts ? props.maxPosts : false;
    const sectionName = props.sectionName ? props.sectionName : false;
    const [thisTracks, setThisTracks] = useState([]);

    const showTracks = useCallback(async () => { // showPosts is only recreated when listOfUsers changes
        //e.preventDefault();
        try {
            let tracks = [];
            tracks = await TrackService.getRand10Tracks();
            setThisTracks(tracks);
            console.log(tracks);
        } catch(error) {
            console.error('Error displaying posts', error);
        }
        setIsLoading(false)
    }, [props.passedData, maxPosts, sectionName]);
    
    useEffect(() => {
        showTracks();
        // everytime 'pageNumber' is changed, refresh the element so that a new page of posts are loaded in
    }, [showTracks]);

    const testimonials = [
        {
          quote:
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
          name: "Charles Dickens",
          title: "A Tale of Two Cities",
        },
        {
          quote:
            "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
          name: "William Shakespeare",
          title: "Hamlet",
        },
        {
          quote: "All that we see or seem is but a dream within a dream.",
          name: "Edgar Allan Poe",
          title: "A Dream Within a Dream",
        },
        {
          quote:
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
          name: "Jane Austen",
          title: "Pride and Prejudice",
        },
        {
          quote:
            "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
          name: "Herman Melville",
          title: "Moby-Dick",
        },
      ];

    if (isLoading) {
        return (
            <div>loading...</div>
        )
    }
    
    return (
        <div className='max-w-[400px] md:min-w-[760px]'>
            <InfiniteMovingCards items={thisTracks} direction='right' speed='slow'></InfiniteMovingCards>
        </div>
    )
}