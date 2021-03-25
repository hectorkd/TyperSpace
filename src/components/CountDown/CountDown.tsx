import React, { useState, useEffect } from 'react';

type CountDownProps = {
  countdown: number;
};

const CountDown: React.FC<CountDownProps> = (props) => {
  const [counter, setCounter] = useState(props.countdown);

  useEffect(() => {
    if (!counter) return;

    const timer = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return <div>{counter > 0 ? <h1>{counter}</h1> : <h2>START</h2>}</div>;
};

export default CountDown;
