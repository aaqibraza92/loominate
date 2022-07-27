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

const DesktopGuidelines = () => {
    
  return (
    <div className="white-box">
      <h5>GUIDELINES</h5>
         <div className="guidelines">
         <Accordion defaultActiveKey="">
  <Accordion.Item eventKey="1">
    <Accordion.Header>1. Be kind to each other</Accordion.Header>
    <Accordion.Body>
    The one simple rule to rule them all.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>2. Be Constructive</Accordion.Header>
    <Accordion.Body>
    Your words and actions matter, and are representative of your organization’s culture. Solutions and ideas eat complaining for breakfast and help drive change.
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="3">
    <Accordion.Header>3. Unite</Accordion.Header>
    <Accordion.Body>
    The strength of our community comes from its diversity. Loominate weaves together the kindness and minds of colleagues from a wide range of backgrounds and beliefs. Use it to help shape your ideas and understanding. Not understanding someone’s viewpoint doesn’t mean that it’s wrong. Loominate is a place for rational discussion, debates and leveraging our differences!

    </Accordion.Body>
  </Accordion.Item>
</Accordion>
              </div>
</div>
  )
}

export default DesktopGuidelines