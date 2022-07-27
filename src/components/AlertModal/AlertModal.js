import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./AlertModal.scss";

class AlertModal extends Component {
  constructor(props) {
    super(props);
    window.AlertModal = this;
    this.state = {
      showmodal: false,
      message: "02",
      title: "",
      isyes: false,
      size: "",
      fullScreen: false,
      callbackfunc: () => {},
    };
  }

  hide() {
    this.setState({
      showmodal: false,
    });
  }

  show(msg, title, callback, size = "xs", fullScreen = false) {
    let res = this.state.isyes;
    this.setState({
      showmodal: true,
      message: msg,
      title: title,
      callbackfunc: callback,
      fullScreen: fullScreen,
      size: size,
    });
    return res;
  }
  toggleit() {
    this.setState({ showmodal: false });
  }

  onclickyes() {
    this.setState({ isyes: true, showmodal: false });
    this.state.callbackfunc();
  }
  setmessage(message) {
    this.setState({ message: message });
  }
  setcallback(callback) {
    this.setState({ callbackfunc: callback });
  }

  static show(
    message,
    title = "",
    callback = () => {},
    size = "xs",
    fullScreen = false
  ) {
    return window.AlertModal.show(message, title, callback, size, fullScreen);
  }

  static hide() {
    return window.AlertModal.hide();
  }

  render() {
    return (
      <>
      <style jsx="true">{
        `
        .modal-fullscreen .btn-close,.modal-fullscreen .modal-footer button {
          position: relative;
          right: 22px;
          top: 3px;
        }
        `
      }
 
      </style>
          <Modal
        size={this.state.size}
        isOpen={this.state.showmodal}

        toggle={(e) => {
          this.setState({ showmodal: false });
        }}
backdrop={true}
keyboard={false} //for escape key
        centered={true}
        className={`modal-dialog myallrtt ${this.props.className}`}
        backdrop={true}
        keyboard={true}
        fullscreen={this.state.fullScreen}
      >
        {/* <ModalHeader
          className="header_area_alert bBnone"
          charcode=""
          toggle={() => this.toggleit()}
        >
          {this.state.title && (
            <p style={{color : "#000"}} className="fBold fs24 mb0 text-capitalize">
              {this.state.title}
            </p>
          )}
        </ModalHeader> */}
        <ModalBody className="p-3">{this.state.message}</ModalBody>
        {/* <ModalFooter>
          <Button
            size="sm"
            style={{
              backgroundColor: "#EC7523",
              color: "white",
              fontFamily: "Arial",
              padding: "5px 25px",
              border : "none",
            }}
            onClick={() => this.onclickyes()}
          >
            Ok
          </Button>
        </ModalFooter> */}
      </Modal>
      </>
  
    );
  }
}

export default AlertModal;
