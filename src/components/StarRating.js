import React, { useState } from 'react';

const StarRating = ({ totalStars = 5, fixedRating, size, settingRating }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const isFixed = fixedRating != null; // Check if fixedRating is provided

  const handleMouseOver = (value) => {
    if (!isFixed) {
      setHoverRating(Math.ceil(value));
    }
  };

  const handleClick = (value) => {
    if (!isFixed) {
      setRating(Math.ceil(value));
      settingRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!isFixed) {
      setHoverRating(0);
    }
  };

  const renderStar = (index) => {
    const effectiveRating = isFixed ? fixedRating : rating;
    const isFullStar = hoverRating > index || (!hoverRating && effectiveRating > index);
  
    // Add 'cursor-not-allowed' or 'cursor-pointer' based on fixedRating
    const cursorStyle = isFixed ? 'cursor-default' : 'cursor-pointer';
  
    return (
      <span
        key={index}
        className={`${size} ${cursorStyle} ${isFullStar ? 'text-orange-400' : 'text-gray-400'}`}
        onMouseOver={() => handleMouseOver(index + 1)}
        onClick={() => handleClick(index + 1)}
      >
        ★
      </span>
    );
  };

  return (
    <div onMouseLeave={handleMouseLeave}>
      {[...Array(totalStars)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default StarRating;
