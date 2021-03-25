import React, { useEffect } from 'react';

type CountDownProps = {
  countdown: number;
  setCountDown: any;
};

const CountDown: React.FC<CountDownProps> = (props) => {
  useEffect(() => {
    if (!props.countdown) return;

    const timer = setInterval(() => {
      props.setCountDown(props.countdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [props.countdown]);

  return (
    <div>
      {props.countdown > 0 ? <h1>{props.countdown}</h1> : <h2>START</h2>}
    </div>
  );
};

export default CountDown;
