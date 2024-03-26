import { useEffect } from 'react';
import { motion, stagger, useAnimate, useAnimation } from 'framer-motion';

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Greeting = ({ words1, words2, className }) => {
  //const [scope, animate] = useAnimate();
  const words1Controls = useAnimation();
  const words2Controls = useAnimation();
  let words1Array = words1.split(' ');
  let words2Array = words2.split(' ');

  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }

  useEffect(() => {
    const sequence = async () => {
      await words1Controls.start(i => ({
        opacity: 1,
        transition: { duration: 2, delay: i * 0.2 },
      }));
      words2Controls.start(i => ({
        opacity: 1,
        transition: { duration: 2, delay: i * 0.2 },
      }));
    };
    
    sequence();
  }, [words1Controls, words2Controls]);
  
//   useEffect(() => {
//     animate(
//       'span',
//       {
//         opacity: 1,
//       },
//       {
//         duration: 2,
//         delay: stagger(0.2),
//       }
//     );
//   }, [scope.current]);

//   const renderWords1 = () => {
//     return (
//       <motion.div ref={scope}>
//         {words1Array.map((word, idx) => {
//           return (
//             <motion.span
//               key={word + idx}
//               className="text-black opacity-0 dark:text-white"
//             >
//               {word}{' '}
//             </motion.span>
//           );
//         })}
//       </motion.div>
//     );
//   };

  const renderWords = (wordsArray, controls) => {
    return (
      <motion.div>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              custom={idx}
              //initial={{ opacity: 0 }}
              animate={controls}
              className="text-black opacity-0 dark:text-white"
            >
              {word}{' '}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };
  
  return (
    <div className={cn('font-bold', className)}>
      <div className="mt-2">
        <div className="text-4xl leading-snug tracking-wide text-black dark:text-white">
            {renderWords(words1Array, words1Controls)}
            {renderWords(words2Array, words2Controls)}
        </div>
      </div>
    </div>
  );
};
