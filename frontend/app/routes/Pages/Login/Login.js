import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Form,
    FormGroup,
    FormText,
    Input,
    CustomInput,
    Button,
    Label,
    EmptyLayout,
    ThemeConsumer
} from './../../../components';

import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";



const Login = () => (
    <EmptyLayout>
        <EmptyLayout.Section center>
            { /* START Header */}
            <HeaderAuth 
                title="Sign In to Application"
            />
            { /* END Header */}
            { /* START Form */}
            <Form className="mb-3">
            <Input type="hidden" name="form_flag"  id="form_flag" value="login"/>
                <FormGroup>
                    <Label for="email">
                        Email Adress
                    </Label>
                    <Input type="email" name="email" id="email" placeholder="Enter email..." className="bg-white" required/>
                    <FormText color="muted">
                        We&amp;ll never share your email with anyone else.
                    </FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input type="password" name="password" id="password" placeholder="Password..." className="bg-white" required/>
                </FormGroup>
                <FormGroup>
                    <CustomInput type="checkbox" id="rememberPassword" label="Remember Password" inline />
                </FormGroup>
                <input type="submit" value="Sign In" class="btn btn-primary btn-block" />
               
                
            </Form>
            { /* END Form */}
            { /* START Bottom Links */}
            <div className="d-flex mb-5">
                <Link to="/pages/forgotpassword" className="text-decoration-none">
                    Forgot Password
                </Link>
                <Link to="/pages/register" className="ml-auto text-decoration-none">
                    Register
                </Link>
            </div>
            { /* END Bottom Links */}
            { /* START Footer */}
            <FooterAuth />
            { /* END Footer */}
        </EmptyLayout.Section>
    </EmptyLayout>
);

export default Login;
