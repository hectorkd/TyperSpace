import React from 'react';
import { useHistory } from 'react-router-dom';

import './styles/Footer.scss';

const Footer: React.FC = () => {
  const history = useHistory();

  function handleClick(): any {
    return history.push('/');
  }

  return (
    <div className="footer-container">
      <h3 className="logo" onClick={handleClick}>
        Typerspace <span>&#169;</span> 2021
      </h3>
      <ul className="footer-list">
        <li className="footer-list-item">
          <p className="item-name">help</p>
        </li>
        <li className="footer-list-item">
          <p className="item-name flash">insert coin</p>
        </li>
        <li className="footer-list-item">
          <p className="item-name">contact</p>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
