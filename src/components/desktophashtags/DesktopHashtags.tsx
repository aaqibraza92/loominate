import React from 'react'
import { Button, Col, Container, Dropdown, Nav, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import IconFeed from '../../assets/images/IconFeed';
import IconInitiatives from '../../assets/images/IconInitiatives';
import IconLeaderboard from '../../assets/images/IconLeaderboard';
import IconTrending from '../../assets/images/IconTrending';
import images from '../../assets/images/images'
import IcoMoon from '../icon/IcoMoon';
import InputSearch from '../input/InputSearch';
import "./styles.scss";

const DesktopHashtags = () => {
    
  return (
    <div className="white-box d-none">
      <h5><Stack direction='horizontal' gap={2}><IconTrending/> <span>TRENDING HASHTAGS</span></Stack></h5>
         <div className="hashtags-list">
               <Stack direction='horizontal'>
         <div className="hashtag">
                    <Link to="/">
                    #culture
                    </Link> 
                    
                    <Link to="/" >
                    #design
                    </Link>
                    
                    <Link to="/" >
                    #popular trends
                    </Link>
                    
                    <Link to="/" >
                    #burnouts
                    </Link>
                    
                    <Link to="/" >
                    #motivation
                    </Link>
                    
                    <Link to="/" >
                    #career
                    </Link>
                    
                    <Link to="/" >
                    #productivity
                    </Link>
                    
                    <Link to="/" >
                    #problems
                    </Link>
                    
                    <Link to="/" >
                    #covid
                    </Link>
                    
                    <Link to="/" >
                    #workfromhome
                    </Link>
                    
                    <Link to="/" >
                    #tools
                    </Link>
                </div>
                </Stack>
              </div>
</div>
  )
}

export default DesktopHashtags