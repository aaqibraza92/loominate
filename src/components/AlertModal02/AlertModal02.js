import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./AlertModal02.css";

class AlertModal02 extends Component {
  constructor(props) {
    super(props);
    window.formmodal02 = this;
    this.state = {
      showmodal: false,
      message: "02",
      title: "",
      isyes: false,
      size: "",
      buttontext: "OK",
      fullscreen: false,
      showCloseButton: true,

      callbackfunc: () => {},
    };
  }

  hide() {
    this.setState({
      showmodal: false,
    });
  }

  show(
    msg,
    title,
    callback,
    size = "xs",
    buttontext = "OK",
    fullscreen = false,
    showCloseButton = true
  ) {
    let res = this.state.isyes;
    this.setState({
      showmodal: true,
      message: msg,
      title: title,
      callbackfunc: callback,
      size: size,
      buttontext: buttontext,
      fullscreen: fullscreen,
      showCloseButton: showCloseButton,
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
    buttontext = "OK",
    fullscreen = false,
    showCloseButton = true
  ) {
    return window.formmodal02.show(
      message,
      title,
      callback,
      size,
      buttontext,
      fullscreen,
      showCloseButton
    );
  }

  static hide() {
    return window.formmodal02.hide();
  }

  render() {
    return (
      <Modal
        size={this.state.size}
        isOpen={this.state.showmodal}
        toggle={this.state.toggleit}
        centered={true}
        className={`modal-dialog myallrtt ${this.props.className}`}
        backdrop="static"
        keyboard={false}
      >
        {this.state.showCloseButton && (
          <ModalHeader
            className="header_area_alert"
            charcode="Y"
            toggle={() => this.toggleit()}
          >
            <span className="alertmodal_title"> {this.state.title}</span>
          </ModalHeader>
        )}
        {!this.state.showCloseButton && (
          <ModalHeader className="header_area_alert">
            <span className="alertmodal_title"> {this.state.title}</span>
          </ModalHeader>
        )}
        <ModalBody className="p-2">{this.state.message}</ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="secondary"
            style={{
              backgroundColor: "#4B5D67",
              color: "white",
              fontFamily: "Arial",
              padding: "5px 25px",
            }}
            onClick={() => this.onclickyes()}
          >
            {this.state.buttontext || "OK"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AlertModal02;
