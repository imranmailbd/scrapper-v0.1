import React from 'react';
import { Container, Row, Col } from './../../../components';

import {
    AdvancedTableA,
    AdvancedTableB,
    BasicTable,
    BorderedTable,
    CellEdit,
    ClearSearch,
    LargeTable,
    SortTable
} from './components';
import { HeaderMain } from "../../components/HeaderMain";

export const StockMarket = () => (
    <Container>
        <HeaderMain 
            title="Stock Tables"
            className="mb-5 mt-4"
        />
        <Row className="mb-5">
            <Col>
                <AdvancedTableA />
            </Col>
        </Row>
        
    </Container>
);
