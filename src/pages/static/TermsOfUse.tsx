import { Checkbox } from 'antd';
import React, { useState } from 'react'
import { Button, Carousel, Col, Container, Dropdown, Nav, Row, Stack } from 'react-bootstrap'
import images from '../../assets/images/images'
import colors from '../../commons/styles/colors';
import ButtonGradient from '../../components/button/ButtonGradient';
import TermAndCondition from '../../components/view/TermAndCondition';
import "./styles.scss";


const TermsOfUse = () => {
  const [agreeTerm, setAgreeTerm] = useState(false);

return (
<>
<div className="terms-of-use">
    <Container>
        <Row>            
        <Col xl={6}>            
                <Stack className="v-head align-items-center justify-content-center">
                <img src={images.bannerSecure} />
                </Stack>
            </Col>        
        <Col xl={6}>    
            <div className="tou-text">  
        <Carousel>
        <Carousel.Item>
              <h3>Terms of Use</h3>
            <div className="box-term">
              <TermAndCondition />
            </div>
            <Stack className="my-3">
              <Checkbox
                checked={agreeTerm}
                onChange={() => setAgreeTerm(!agreeTerm)}
                className="mb-4"
              > 
                I’ve read and agree with the Terms of Use
              </Checkbox>
            </Stack>
              <ButtonGradient>
                  Go Back to Settings
          </ButtonGradient>
            </Carousel.Item>
            </Carousel>
            </div>
            </Col>
        </Row>
    </Container>
</div>
</>

)
}

export default TermsOfUse