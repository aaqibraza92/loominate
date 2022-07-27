import React from 'react'
import { Dropdown} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import "./styles.scss";
import { ReactComponent as IconShare } from "../../assets/icons/share.svg";
import ShareSocialSheet from '../share/ShareSocialSheet';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, FacebookMessengerShareButton, FacebookShareButton, LineIcon, LineShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { Space } from 'antd';

const DesktopShareDropdown = () => {
  interface Props {
    containerStyle?: any;
    open?: boolean;
    data?: any;
    url?: string;
    onClose?: any;
  }
  
  return (
    <div className="desktop-only">
      <Dropdown drop='down'>
  <Dropdown.Toggle variant='primary' id="dropdown-basic">
  <IconShare />
  </Dropdown.Toggle>

  <Dropdown.Menu className='desktop-share-icons'>
    
  <Dropdown.Item href="#/action-1"><FacebookIcon size={32} round={true} /> Facebook</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><FacebookMessengerIcon size={32} round={true} /> Messenger</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><TelegramIcon size={32} round={true} /> Telegram</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><TwitterIcon size={32} round={true} /> Twitter</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><WhatsappIcon size={32} round={true} /> WhatsApp</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><LineIcon size={32} round={true} /> Line</Dropdown.Item>
  <Dropdown.Item href="#/action-1"><EmailIcon size={32} round={true} /> Email</Dropdown.Item>
  <Dropdown.Item href="#/action-1"> <LinkedinIcon size={32} round={true} /> LinkedIn</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
</div>
  )
}

export default DesktopShareDropdown