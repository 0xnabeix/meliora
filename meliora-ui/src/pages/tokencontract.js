import React, { Fragment } from "react";

import Breadcrumb from "../component/common/breadcrumb/breadcrumb";
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Card,
  CardBody,
  Label,
  Button,
  Input
} from "reactstrap";

const TokenContract = (props) => {

  return (
    <Fragment>
      <Breadcrumb parent="Forms / Form Controls" title="Token Contract" />
      <Container fluid={true}>
        <Row>
          <Col className="token-contract" md="12" xl="6">
            <Form className="form theme-form">
              <Card>
                <CardBody>
                  <Row>
                    <Col md="7">
                      <Label>
                        * Token name
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        placeholder="MyNewProjectToken" required
                      />
                    </Col>
                    <Col md="5">
                      <p>Enter name of the project without spaces, usually 5-25 symbols. Lower and uppercase can be used</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="7">
                      <Label>
                        * Token symbol
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        placeholder="NEW" required
                      />
                    </Col>
                    <Col md="5">
                    </Col>
                  </Row>
                  <Row>
                    <Col md="2">
                      <Label>
                        * Decimals
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        placeholder="18" required
                      />
                    </Col>
                    <Col md="5">
                      <p>Defines the number of decimals for the token. 0-50 numerals are accepted. 18 as common practice</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="token-type">
                <CardBody>
                  <Label style={{marginBottom:10}}>Choose Type of Token</Label>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Input
                          id="radio-erc20"
                          type="radio"
                          name="tokentype"
                          value="erc20"
                          defaultChecked
                        />
                        <Label for="radio-erc20">ERC20</Label>
                      </Col>
                      <Col md="8">
                        <p for="radio-erc20">ERC-20 is recommended option. Accepted by the most exchanges.</p>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Input
                          id="radio-erc223"
                          type="radio"
                          name="tokentype"
                          value="erc223"
                        />
                        <Label for="radio-erc223">ERC223</Label>
                      </Col>
                      <Col md="8">
                        <p>ERC-223 is almost the same as ERC-20. Provides extra safety during token transfers.</p>
                      </Col>
                    </Row>
                  </FormGroup>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Row>
                    <Col md="8">
                      <Label>
                        * Token Owner
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        placeholder="0xD0593B233Be4411A236F22b42087345E1137170b" required
                      />
                    </Col>
                    <Col md="4">
                      <p>ETH address (not exchange address). This address will be owner of the token (after sale end date). Double check the address (and access to it) before submission</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Form>
          </Col>

          <Col md="12" xl="6">
            <Card>
              <CardBody>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label>Define address for tokens (after minting it will be sent to this address)<br></br>Address</Label>
                      <Input
                          className="form-control"
                          type="text"
                          placeholder="Enter the address of the receipient's wallet"
                        />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label>Name</Label>
                      <Input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label>Token amount</Label>
                      <Input
                          className="form-control"
                          type="text"
                          placeholder=""
                        />
                    </Col>
                  </Row>
                </FormGroup>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="token-button">
                <Button color="primary" className="mr-1">Create</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default TokenContract;
