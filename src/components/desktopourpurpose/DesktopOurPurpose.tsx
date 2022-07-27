import React from 'react'
import { Button, Col, Container, Dropdown, Nav, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import IconFeed from '../../assets/images/IconFeed';
import IconInitiatives from '../../assets/images/IconInitiatives';
import IconLeaderboard from '../../assets/images/IconLeaderboard';
import images from '../../assets/images/images'
import IcoMoon from '../icon/IcoMoon';
import InputSearch from '../input/InputSearch';
import "./styles.scss";

const DesktopOurPurpose = () => {
    
  function gettenant() {
    const tenantName: any = localStorage.getItem("tenantName");
    return tenantName;
  }
  return (
    <div className="white-box blue-gradient">
      <h5>About {gettenant()}</h5>
         <div className="my-community">
           <p className='mb-0'>Loominate is a place to be your magical self. Ask those silly questions, seek support for your struggles, join moonshot ideas and be the changemaker!</p>
              </div>
</div>
  )
}

export default DesktopOurPurpose