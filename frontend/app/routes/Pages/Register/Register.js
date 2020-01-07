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

const Register = () => (
    <EmptyLayout>
        <EmptyLayout.Section center width={ 480 }>
            { /* START Header */}
            <HeaderAuth 
                title="Create Account"
            />
            { /* END Header */}
            { /* START Form */}
            <Form className="mb-3">
            <Input type="hidden" name="form_flag"  id="form_flag" value="register"/>
                <FormGroup>
                    <Label for="name">
                        Name
                    </Label>
                    <Input type="text" name="name" id="name" placeholder="Enter a Name..." className="bg-white" required />
                </FormGroup>
                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input type="password" name="password" id="password" placeholder="Password..." className="bg-white" required />
                </FormGroup>
                <FormGroup>
                    <Label for="repassword">
                        Repeat Password
                    </Label>
                    <Input type="password" name="repassword" id="repassword" placeholder="Password..." className="bg-white" required />
                </FormGroup>
                <FormGroup>
                    <Label for="email">
                        Email Adress
                    </Label>
                    <Input type="email" name="email" id="email" placeholder="Enter email..." className="bg-white" required />
                    <FormText color="muted">
                        We&amp;ll never share your email with anyone else.
                    </FormText>
                </FormGroup>
                <FormGroup>
                    <CustomInput type="checkbox" id="acceptTerms" label="Accept Terms and Privacy Policy" inline />
                </FormGroup>
                <input type="submit" value="Sign In" class="btn btn-primary btn-block" />
            </Form>
            { /* END Form */}
            { /* START Bottom Links */}
            <div className="d-flex mb-5">
                <Link to="/pages/forgot-password" className="text-decoration-none">
                    Forgot Password
                </Link>
                <Link to="/pages/login" className="ml-auto text-decoration-none">
                    Login
                </Link>
            </div>
            { /* END Bottom Links */}
            { /* START Footer */}
            <FooterAuth />
            { /* END Footer */}
        </EmptyLayout.Section>
    </EmptyLayout>
);

export default Register;
