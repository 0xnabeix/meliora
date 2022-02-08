import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons' 
import { faTwitter } from '@fortawesome/free-brands-svg-icons' 
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faMedium } from '@fortawesome/free-brands-svg-icons'
const Footer = (props) => {
  return (
    <footer className="footer">
      <Container fluid={true}>
        <Row className="footer-logo">
          <Col>
            <Link to={`${process.env.PUBLIC_URL}/projects`}>
              <img
                src={require("../../../assets/images/logo/logo.png")}
                alt=""
              />
            </Link>
          </Col>
        </Row>
        <Row className="footer-social">
          <a href="https://t.me/meliorafinance" target="_blank"><FontAwesomeIcon icon={faTelegram} /></a>
          <a href="https://github.com/meliora-finance" target="_blank"><FontAwesomeIcon icon={faGithub} /></a>
          <a href="https://medium.com/@meliorafinance" target="_blank"><FontAwesomeIcon icon={faMedium} /></a>
          <a href="https://twitter.com/meliorafinance" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a>
        </Row>
        <Row>
          <Col className="footer-copyright">
            <p className="mb-0">Copyright © 2021. All rights reserved By <span>Meliora</span>.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
