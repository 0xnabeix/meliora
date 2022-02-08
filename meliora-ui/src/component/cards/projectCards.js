import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons' 
import { faTwitter } from '@fortawesome/free-brands-svg-icons' 
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  CardBody
} from "reactstrap";
import { ProgressBar } from "react-bootstrap";
let unixTimeToUTC = (timeStamp) => {
    var dateTime = new Date(timeStamp * 1000);
    return dateTime.toUTCString();
    
    // return urn `${moment(timeStamp / 1000).format("YYYY-MM-DD hh:mm a")};
  }

const ProjectCards = (props) => {
  return (
    <Card>
        <CardBody className="pp-card-body">
            <div className="pp-card-top">
                <Link>
                <div className="icon-box">
                    <span><img src="https://bscpad.s3-ap-southeast-1.amazonaws.com/projects/greenheart.jpg" alt="#" /></span>
                </div>
                </Link>
                <div className="title-box">
                    <h3 className="d-flex align-items-center">
                        <Link to={`${process.env.PUBLIC_URL}/project`}>
                            <div>{props.saleTitle}</div>
                        </Link>
                    </h3>
                    <div className="item-social">
                        <a target="_blank" href={props.telegram}><FontAwesomeIcon icon={faTelegram} /></a>
                        <a target="_blank" href={props.twitter}><FontAwesomeIcon icon={faTwitter} /></a>
                        <a target="_blank" href={props.website}><FontAwesomeIcon icon={faGlobe} /></a>
                    </div>
                    <Link className="items-morex" to={`${process.env.PUBLIC_URL}/projects`}>
                    {   props.status == 1 && 
                            <span className="pp-status-open"><FontAwesomeIcon icon={faCircle} /> Open</span>
                    }
                    {   props.status == 2 && 
                            <span style={{color: "green"}} className="pp-status-open"><FontAwesomeIcon icon={faCircle} /> Up comming</span>
                    }
                    {   props.status == 3 && 
                            <span style={{color: "red"}} className="pp-status-open"><FontAwesomeIcon icon={faCircle} /> Close</span>
                    }
                    </Link>
                </div>
            </div>
            <Link target="_blank" to={`${process.env.PUBLIC_URL}/project/${props.ID}`}>
            <div className="item-desc mb-2">
                {/* <div className="item-short-desc">Greenheart is a sustainable DeFi token led by Greenheart CBD - one of Europe's leading seed to shelf producers of CBD oil</div>
                <div className="item-learn-more">
                <Link target="_blank" to={`${process.env.PUBLIC_URL}/project/${props.ID}`}>Details</Link> */}
                {/* </div> */}
                
                    <div className="row">
                        <div className="pp-card-col col text-start">Opening Time <b>{unixTimeToUTC(props.opening)}</b></div>
                        <div className="pp-card-col col text-start">Closing Time <b>{unixTimeToUTC(props.closing)}</b></div>
                    </div>
                
            </div>
            {/* <div style={{"background":"black", "width":"100%"}}></div>  */}
            {/* <Link> */}
                <div className="part-prize">
                    <div className="pp-card-info mb-3">
                        <div className="pp-card-col">Swap rate<br /><b className="nowrap">TBA</b></div>
                        <div className="pp-card-col text-center ps-28">Hard Cap<br/><b>{props.hardCap}</b></div>
                        <div className="pp-card-col text-end">Soft Cap<br /><b>{props.softCap}</b></div>
                    </div>
                    <div className="pp-card-info d-block">
                        <div className="pp-card-progress-wrap">
                            <div className="mb-2 d-flex justify-content-between align-items-center pp-card-progress-top">
                                <div className="pp-card-col">Progress</div>
                                <div className="pp-card-col text-end">Participants <b className="text-participants font-12">{props.totalInvestorsCount}</b></div>
                            </div>
                            <div className="pp-card-progress">
                                {/* <div style={{"margin-bottom": "10px"}}> */}
                                    <ProgressBar variant="info" now={((props.tokensSold/props.totalTokens)*100).toFixed(2)} />
                                {/* </div> */}
                                <div style={{"margin-top":"10px"}} className="pp-card-progress-label">
                                    <span><b>{((props.tokensSold/props.totalTokens)*100).toFixed(2)}%</b></span>
                                    <span className="text-allocation"><b>{props.tokensSold}/{props.totalTokens}</b> {props.symbol}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </Link> */}
            </Link>
        </CardBody>
    </Card>
  );
};

export default ProjectCards;
