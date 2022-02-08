import React, { Fragment } from "react";
import Breadcrumb from "../component/common/breadcrumb/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
const Create = (props) => {
  return (
    <Fragment>
      <Breadcrumb parent="Forms / Form Controls" title="Create Sale On BSC Network" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form className="form theme-form">
              <Card>
                <CardHeader>
                  <h5>Presale Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * BEP20 Token Address
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0xb64cd4f56043f8d80691433e395d08b1bebdadf0" required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Project Name
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="Meliora"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Token Price (BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0.005" required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Address for unsold tokens.
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0x000000000000000000000000000000000000dEaD"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Hard Cap (BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0" required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Soft Cap (BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Max. cap per wallet (BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0" required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Min. cap per wallet (BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Starts at
                        </Label>
                        <Input
                            className="form-control digits"
                            id="opens-at-time"
                            type="datetime-local"
                            defaultValue="2021-05-19 20:00:00"
                          />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Ends at
                        </Label>
                        <Input
                            className="form-control digits"
                            id="closes-at-time"
                            type="datetime-local"
                            defaultValue="2021-05-19 20:00:00"
                          />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>Whitelist</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                    <FormGroup>
                        <Label>
                          Whitelisted Addreses (Comma-separated)
                        </Label>
                        <textarea
                            className="form-control"
                            rows="5"
                            placeholder="0xfb6116b0987c567930f191b15c945909e168f0a3,0xc7807e24338b41a34d849492920f2b9d0e4de2cd,0xf60c2ea62edbfe808163751dd0d8693dcb30019c"
                          ></textarea>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>Pancake Liquidity Allocation</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Listing Price (E.g. 0.05 BNB)
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0.005" required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Pancake LP Allocation
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="%30" required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Listing Time
                        </Label>
                        <Input
                            className="form-control digits"
                            id="uniswap-listing-time"
                            type="datetime-local"
                            defaultValue="2018-01-19T19:45:00"
                          />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>Project Socials</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Website
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="https://meliora.finance"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Telegram
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="https://t.me/meliorafinance"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Discord
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="https://discord.com/invite/cder34"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Twitter
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="https://twitter.com/meliorafinance"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                    <Button color="primary" className="mr-1">
                      Connect Wallet
                    </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Create;
