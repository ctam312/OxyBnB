// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './BNB.png';
import SearchBar from './SearchBar';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className = "main-burger">
      <li>
        <NavLink exact to="/">
          <img className="logo" src={logo} alt="home-logo"/>
        </NavLink>
      </li>
      <li>
        <SearchBar/>
      </li>
      {isLoaded && (
        <li className = "burger">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;