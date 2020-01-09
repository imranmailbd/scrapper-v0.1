import React, { useState } from 'react';
import { Link } from 'react-router-dom';


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



const FormStockParameter = () =>{ 

    const [count, setCount] = useState(0);
    //console.log(count);
    
    // const handleSubmit2 = () => {
   
    //setCount(count + 1);
    // };
    



    return (
    <React.Fragment>
        <Container><Row> 
        <HeaderMain 
                title="Add New Parameter"
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
                                <Input type="hidden" name="form_flag"  id="form_flag" value="stockparam"/>
                                <FormGroup row>
                                    <Label for="company_symbol" sm={4}>
                                        Company Symbol
                                    </Label>
                                    <Col sm={8}>
                                        <Input 
                                            type="text" 
                                            name="company_symbol" 
                                            id="company_symbol" 
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
                                            id="market_symbol" 
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
                                            <option value="1">Enable</option>
                                            <option value="0">Disable</option>
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

export default FormStockParameter;