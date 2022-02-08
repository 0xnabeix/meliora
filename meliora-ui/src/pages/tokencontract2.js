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
                        placeholder="Meliora" required
                      />
                    </Col>
                    <Col md="5">
                      <p>Enter name of the project without spaces.</p>
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
                        placeholder="MORA" required
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
                      <p>Usally 18</p>
                    </Col>
                  </Row>
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
                      <p>This address will be owner of the token. Please double check.</p>
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
                      <Label>Address for the minted tokens</Label>
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
                          placeholder="Team Wallet"
                        />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label>Total Supply</Label>
                      <Input
                          className="form-control"
                          type="text"
                          placeholder="2000000"
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
