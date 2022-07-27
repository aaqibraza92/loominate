import { Row } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import images from "../../assets/images/images";
import "./styles.scss";

interface Props {
  visible?: boolean;
}

/**
* SplashScreen
* @param {Props} props
* @returns JSX.Element
*/
function SplashScreen(props: Props) {
  const { visible } = props;
  return (
    <></>
    // <Div100vh
    //   className={`m-screen bg-gradient-app splash ${!visible && "hide"}`}
    // >
    //   <div className="bg-sky"></div>
    //   <div>
    //     <div>
    //       <Row className="justify-content-center">
    //         <img src={images.logo} className="logo" alt="logo" />
    //       </Row>
    //       <div className="monster">
    //         <img src={images.monsterBrinjal} alt="monsterBrinjal" />
    //         <img src={images.monsterPinkHorn} alt="monsterPinkHorn" />
    //         <img src={images.monsterVikingGator} alt="monsterVikingGator" />
    //         {/* <img src={images.loomer2} className="loomer2" alt="loomer2" /> */}
    //       </div>
    //       <p className="text">Your Workplace Community!</p>
    //     </div>
    //   </div>
    // </Div100vh>
  );
}

export default SplashScreen;
