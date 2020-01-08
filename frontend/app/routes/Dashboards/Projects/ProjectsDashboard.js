import React from 'react';
import faker from 'faker/locale/en_US';
import { Link } from 'react-router-dom';
import {
    Container,
    Row,
    Card,
    CardBody,
    Badge,
    Table,
    CardTitle,
    Button,
    InputGroup,
    InputGroupAddon,
    Input,
    ListGroup,
    ListGroupItem,
    Media,
    Col
} from './../../../components';
import { setupPage } from './../../../components/Layout/setupPage';

import { HeaderMain } from "../../components/HeaderMain";

import {
    TasksMedia
} from "../../components/ProjectsDashboards/TasksMedia";
import {
    TinyDonutChart
} from "../../components/ProjectsDashboards/TinyDonutChart"
import {
    TinyDonutChartAllProjects
} from "../../components/ProjectsDashboards/TinyDonutChartAllProjects"
import {
    TimelineMini
} from "../../components/Timeline/TimelineMini"
import { DraggableProjects } from './DraggableProjects';

import {
    Route,
    Switch,
    Redirect
} from 'react-router';



const ProjectsDashboard = () =>{

//const userNameDash = null;
var userEmailDash = null;

var storedInfoDash = JSON.parse(localStorage.getItem("userinfo"));

if (storedInfoDash) {            
        //console.log('Not Undefined or Not Null');       
        //const userNameDash = storedInfoDash[3];
        userEmailDash = storedInfoDash[0];
        //console.log(userEmailDash);
} 

if(userEmailDash === null){
//console.log('redirect');
return <Redirect from="/" to="/pages/login" exact />
}

 return (
    <Container>
        <Row className="mb-5">
            <Col lg={ 12 }>
                <HeaderMain 
                    title="A NodeJS Based Scraper Apps"
                    className="mb-4 mb-lg-5"
                />
                <p>
                    Scraping data from stock portal
                </p>
            </Col>            
            <Col lg={ 3 }>
                <div className="hr-text hr-text-left my-2">
                    <span>My Stats</span>
                </div>
                <Table size="sm">
                    <tbody>
                        <tr>
                            <td className="text-inverse bt-0">Total Company Added</td>
                            <td className="text-right bt-0">
                                <Badge color="success" pill>100</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-inverse">Total Market Added</td>
                            <td className="text-right">
                                <Badge color="primary" pill>500</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-inverse">Last Market Data Updated</td>
                            <td className="text-right">
                                <Badge color="info" pill>12:30 pm</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-inverse">Last Login</td>
                            <td className="text-right">
                                <Badge color="secondary" pill>0</Badge>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
        <Row>
            <Col lg={ 4 }>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-3">
                            Projects
                        </CardTitle>
                        <InputGroup>
                            <Input placeholder="Search Projects..." />
                            <InputGroupAddon addonType="append">
                                <Button color="secondary" outline tag={ Link } to="/apps/projects/list">
                                    <i className="fa fa-search"></i>
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </CardBody>
                    
                </Card>
            </Col>
        </Row>
    </Container>
);
};

export default setupPage({
    pageTitle: 'Projects Dashboard'
})(ProjectsDashboard);