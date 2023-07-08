import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/">Device Share</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/stake">Staking Contract</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
