import React, { useState, Component, useEffect } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import axios from 'axios';


import { 
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
    Button,
    InputGroup,
    InputGroupAddon,
    CustomInput,
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText
} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { HeaderDemo } from "../../components/HeaderDemo";


// const StockParamData = {
//     id: '',
//     company_symbol: '',
//     market_symbol: ''
// };
//const [list, setData] = React.useState(null);

const FormStockParameterEdit = (props) =>{ 

   // const [count, setCount] = useState(0);
    //console.log(count);
    
    //const [stockparam, setStockParam] = useState([]);

    //console.log(this.props.match.params.id);

    //console.log(props.match.params.paramId);
    var eid = props.match.params.paramId;
    // const handleSubmit2 = () => {
    // console.log('h2');
    //setCount(count + 1);
    // };


    useEffect(() => {
      getParameter();
    }, []); // Calling getImage function to fetch data

    const [items, set] = useState([]);

    async function getParameter() {
      try {

        const response = await axios.get('http://127.0.0.1:3005/stockParameterEditRead/'+eid);
        let stockparam = response.data[0];
        //console.log(stockparam);

        var stockParmArray = Object.values(stockparam);
        //console.log(stockParmArray);

        // this.items = stockparam.map((item, key) =>
        //     <li key={item.id}>{item.name}</li>
        // );

        // for (var i in stockparam) {  
        //   //console.log(stockparam[i].id);
        //   //console.log(stockparam[i].id);       
        //   //items[i] = stockparam[i].id;
        //   items[0] = stockparam[i].id;
        //   //stockparam[i].company_symbol = `${x}${y}/${v}/${image[i].height}`;
        //   //stockparam[i].market_symbol = Math.floor(Math.random() * 650) + 300;                  
        // }
        // items = stockParmArray;
        //console.log(stockParmArray);
        set(stockParmArray); // setting state after fetching data



      } catch (error) {
        console.error(error);
      }
    }

    //console.log(items);



    // useEffect(() => {
    //     fetch('http://127.0.0.1:3005/stockParameterEditRead/'+eid)
    //       .then(data => {
    //         return data.json();
    //       })
    //       .then(data => {
    //         setStockParam(data);
    //       })
    //       .catch(err => {
    //         console.log(123123);
    //       });
    //   }, []);

    // console.log(stockparam[0]);





    //console.log(Object.entries(obj));
    //const classes = useStyles();


    // useEffect(async () => {
    //     const result = await axios(
    //       'http://127.0.0.1:3005/stockParameterEditRead/'+eid
    //     );
    //     setData(result.data);
    //   });

    // axios.get('http://127.0.0.1:3005/stockParameterEditRead/'+eid)
    //           .then(res => {
    //             //console.log(res);
    //             var stockparam = res.data[0];
    //             setData(res.data[0]);
    //             //this.setState({ stockparam });
    //             //const [count, stockparam] = useState(0);
    //             //console.log(stockparam);
    //           })
    



    return (
    <React.Fragment>
        <Container><Row> 
        <HeaderMain 
                title="Edit Parameter"
                className="mb-5 mt-4"
            />
                
            </Row>
            { /* END Header 1 */}
            { /* START Section 1 */}
            <Row>
                <Col lg={ 6 }>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle tag="h6" className="mb-4">
                                *: Essential Data - must be enter 
                                <span className="small ml-1 text-muted">
                                    #1.01
                                </span>
                            </CardTitle>
                            { /* START FormStockParam */}
                            <Form>
                                { /* START Input */}
                                <Input type="hidden" name="form_flag"  id="form_flag" value="stockparamedit"/>
                                <Input type="hidden" name="edit_id_send" id="edit_id_send" value={items[1]}/>
                                <FormGroup row>
                                    <Label for="company_symbol" sm={4}>
                                        Company Symbol
                                    </Label>
                                    <Col sm={8}>
                                        <Input 
                                            type="text" 
                                            name="company_symbol" 
                                            id="company_symbol" defaultValue={items[3]} 
                                            placeholder="Enter Company Symbol..." 
                                        />
                                    </Col>
                                </FormGroup>
                                { /* END Input */}
                                { /* START Input */}
                                <FormGroup row>
                                    <Label for="market_symbol" sm={4}>
                                        Market Symbol
                                    </Label>
                                    <Col sm={8}>
                                        <Input 
                                            type="text" 
                                            name="market_symbol" 
                                            id="market_symbol" defaultValue={items[2]} 
                                            placeholder="Enter Market Symbol..." 
                                        />
                                    </Col>
                                </FormGroup>
                                { /* END Input */}                                
                                { /* START Select */}
                                <FormGroup row>
                                    <Label for="status" sm={4}>
                                        Status
                                    </Label>
                                    <Col sm={8}>
                                        <CustomInput 
                                            type="select" 
                                            name="status" 
                                            id="status"  
                                        >
                                            <option value="">Select Status...</option>
                                            <option value="1" selected={(items[4] == 1) ? 'selected' : ''}>Enable</option>
                                            <option value="0" selected={(items[4] == 0) ? 'selected' : ''}>Disable</option>
                                        </CustomInput>
                                    </Col>
                                </FormGroup>
                                { /* END Select */}
                                
                                <FormGroup row>
                                    
                                    <Col sm={8}>
                                        
                                        <Button type="submit" color="primary">Save</Button>
                                        

                                    </Col>
                                </FormGroup>
                                { /* END Textarea */}
                            </Form>
                            { /* END Form */}
                        </CardBody>
                    </Card>
                    
                </Col>
                
            </Row>
            { /* END Section 1 */}

        </Container>
    </React.Fragment>
);
}

export default FormStockParameterEdit;