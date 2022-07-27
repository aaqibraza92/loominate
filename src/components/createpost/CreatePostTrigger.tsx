import React,{useState} from 'react'
import IconInitiativeGrey from '../../assets/images/IconInitiativeGrey';
import IconPollGrey from '../../assets/images/IconPollGrey';
import IconPostGrey from '../../assets/images/IconPostGrey';
import { PostType } from '../../models/post.model';
import ActionSheetPost from '../post/ActionSheetPost';
import "./styles.scss";

const CreatePostTrigger = () => {
  const[tab,setTab]=useState("tab1");
    
  return (
   

    <>
    <ul className='post-type-btn'>
      <li onClick={()=>setTab("tab1")} className={`${tab==="tab1" && "activeTab"} tab-items`}>
        <IconPostGrey/> Post
      </li>
  
      <li onClick={()=>setTab("tab2")} className={`${tab==="tab2" && "activeTab"} tab-items`}>
      <IconPollGrey/> Poll
      </li>

      <li onClick={()=>setTab("tab3")} className={`${tab==="tab3" && "activeTab"} tab-items`}>
      <IconInitiativeGrey/> Initiative
      </li>
    </ul>
    <div>
      {
        tab==="tab1" &&
        <div><ActionSheetPost type={PostType.Post}/></div>
      }

{
        tab==="tab2" &&
        <div><ActionSheetPost type={PostType.Poll}/></div>
      }

{
        tab==="tab3" &&
        <div><ActionSheetPost type={PostType.Initiative}/></div>
      }
    </div>
    </>
  )
}

export default CreatePostTrigger

