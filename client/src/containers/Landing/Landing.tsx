import React from 'react';
import { useHistory } from 'react-router-dom';

const Landing: React.FC = () => {
const history = useHistory();
  //generate random string
  function makeString(): string {
    let outString = '';
    const inOptions = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    console.log('generated random string', outString);
    return outString;
  }

  //generate random roomID and redirect to avatar page
  function handleClick(): void {
    const roomId = makeString();
    history.push(`/${roomId}`);
  }


  return (
    <div>
      {/* <Link to='/{makeString()}'>
        Create Game
      </Link> */}
      <button type='button' onClick={handleClick}>
        Create Game
      </button>
    </div>
  );
};

export default Landing;
