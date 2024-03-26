import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React, { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";


export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className
}) => {
  
    function cn(...inputs) {
        return twMerge(clsx(...inputs));
    }
    
    const containerRef = useRef(null);
    const scrollerRef = useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current.appendChild(duplicatedItem);
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "120s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((rand, idx) => (
          <li
            className="relative w-[150px] border-4 group rounded-xl track border-dark-purple hover:border-orange-400"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))"
            }}
            key={rand.track.name}
          >
            {/* <div className='relative w-1/5 border-4 group rounded-xl track border-dark-purple hover:border-orange-400'> */}
                <img className='' src={rand.track.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                
                <div className='absolute inset-0 flex-col items-center justify-center hidden p-1 rounded-lg opacity-75 group-hover:flex bg-h-grey stroke-hov-blue'></div>
                <div className='absolute inset-0 flex-col items-center justify-center hidden text-center align-middle group-hover:flex text-clip text-balance'>
                    <span className='abrilfatface'>{rand.track.name}</span>
                    <span>{rand.track.artist}</span>
                </div>
                <div className='absolute inset-x-0 bottom-[2] flex items-center justify-center mt-1.5'>
                    <StarRating fixedRating={rand.averageRating} size={'text-xl'}/>
                </div>
            {/* </div> */}

            {/* <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 flex flex-row items-center mt-6">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote> */}
          </li>
        ))}
      </ul>
    </div>
  );
};
