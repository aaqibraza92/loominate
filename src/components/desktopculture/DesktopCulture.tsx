import React from 'react'
import { Accordion} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import IconFeed from '../../assets/images/IconFeed';
import IconInitiatives from '../../assets/images/IconInitiatives';
import IconLeaderboard from '../../assets/images/IconLeaderboard';
import images from '../../assets/images/images'
import IcoMoon from '../icon/IcoMoon';
import InputSearch from '../input/InputSearch';
import "./styles.scss";

const DesktopCulture = () => {
    
  return (
    <div className="white-box">
      <h5>Our culture is <span className='text-primary'>community moderated</span>, help flag:</h5>
         <div className="culture">
           <ul>
             <li>Naming of individual staff members</li>
             <li>Discrimination, Hate Speech or Profanity</li>
             <li>Bullying, Harassment or Trolling</li>
             <li>Sensitive information</li>
             <li>Inappropriate content or Spam</li>
           </ul>
              </div>
</div>
  )
}

export default DesktopCulture