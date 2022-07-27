import { log } from "console";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import images from "../../assets/images/images";
import ButtonGradient from "../../components/button/ButtonGradient";

const options = ["sleepykitten2", "Laborden", "OfficeDesignnoob"];

const InviteAdmin = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    var onOptionClicked = (value: any) => {
        setSelectedOption(value);
        setIsOpen(false);
    
      };
    const onSuccess = () => {
        setSuccess(true);
      };
      const okClick=()=>{
        setSuccess(false);
        props.ifClick(true);
      }
      const toggling = () => setIsOpen(!isOpen);
  return (
    <div className="invite-box">
    
      {success ? (
        <>
          <h5>Success!</h5>
          <p className="small">You have invited @Sleepykitten33 to be {
            props?.isModerate ? "Moderators." : "Admin."
           } </p>
          <Dropdown.Item href="#">
            {" "}
            <div className="v-btn d-grid mt-3">
              <ButtonGradient
                onClick={okClick}
                text="Ok"
                style={{ marginBottom: 16 }}
                className="invite-btn"
              />
            </div>
          </Dropdown.Item>
        </>
      ) : (
        <>
          <h5>
           {
            props?.isModerate ? "Invite New Moderators" : "Invite New Admin"
           }
            </h5>
          <p className="small">
            Only existing users with approved email addresses can be invited to
            be an  {
            props?.isModerate ? "Moderators" : "Admin"
           }. These are likely members of Loominate Open Community.
          </p>
          <div className="select-space">
            <div className="dropDownContainer">
              <div className="DropDownHeader" onClick={toggling}>
                <span>
                  <img width="24" src={images.avatar1} alt="" />{" "}
                  {selectedOption || "SLEEPYKITTEN2"}
                </span>{" "}
                <img width="12" src={images.ArrowDown} alt="" />
              </div>
              {isOpen && (
                <div className="DropDownListContainer">
                  <ul className="DropDownList">
                    {options.map((option) => (
                      <li
                        className="ListItem"
                        onClick={() => onOptionClicked(option)}
                        key={Math.random()}
                      >
                        <img width="24" src={images.avatar1} alt="" /> {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p className="small">
            A invitation to join as an  {
            props?.isModerate ? "Moderators" : "Admin"
           } will be sent to the user. User will
            directly become an {
            props?.isModerate ? "Moderators" : "Admin"
           } once the invitation is accepted,
          </p>
          <div className="v-btn d-grid mt-3">
            <ButtonGradient
              onClick={onSuccess}
              text="Send Invitation"
              style={{ marginBottom: 16 }}
              className="invite-btn"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InviteAdmin;
