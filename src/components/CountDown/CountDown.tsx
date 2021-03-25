import React, { useState, useEffect } from 'react';
// import CountDown from 'react-countdown';

type CountDownProps = {
  countdown: number;
};

const CountDown: React.FC<CountDownProps> = (props) => {
  const [counter, setCounter] = useState(props.countdown);
  // console.log('start countdown from: ', counter);

  useEffect(() => {
    if (!counter) return;

    const timer = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div>
      <h1>{counter}</h1>
    </div>
  );
};

export default CountDown;
