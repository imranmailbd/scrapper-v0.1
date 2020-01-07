import React, { Component } from 'react';
//import { withRouter } from 'react-router-dom';
//import { Route, Link, Redirect, Switch, withRouter } from 'react-router-dom'
//import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { Comparator, dateFilter } from 'react-bootstrap-table2-filter'
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import _ from 'lodash';
import faker from 'faker/locale/en_US';
import moment from 'moment';
import axios from 'axios';
//import SweetAlert from 'sweetalert2-react';
import swal from 'sweetalert';

import {
    Badge,
    Button,
    CustomInput,
    StarRating,
    ButtonGroup
} from './../../../../components';
import { CustomExportCSV } from './CustomExportButton';
import { CustomSearch } from './CustomSearch';
import { CustomPaginationPanel } from './CustomPaginationPanel';
import { CustomSizePerPageButton } from './CustomSizePerPageButton';
import { CustomPaginationTotal } from './CustomPaginationTotal';
import { randomArray } from './../../../../utilities';
import {
    buildCustomTextFilter,
    buildCustomSelectFilter,
    buildCustomNumberFilter
} from './../filters';

// import {
//     Route,
//     Switch
// } from 'react-router';

//swal("Hello world!");


const INITIAL_PRODUCTS_COUNT = 1;

const StockParamStatus = {
    Enabled: 1,
    Disabled: 0,
    Unknown: ''
};

const sortCaret = (order) => {
    if (!order)
        return <i className="fa fa-fw fa-sort text-muted"></i>;
    if (order)
        return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
}

const generateRow = (index) => ({
    id: index,
    market_symbol: faker.commerce.productName(),
    company_symbol:faker.commerce.productName(),
    status: randomArray([
        StockParamStatus.Disabled,
        StockParamStatus.Enabled,
        StockParamStatus.Unknown
    ])
});

export class AdvancedTableA extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          stockparam: [],
          selected: [],
          redirect: false,
          redirect_edit: false,
          redirect_stocktable: false,
          edit_id: 0,
          show:false,
          userEmailDashRedirect:false,
        }

        this.handleEditRow = this.handleEditRow.bind(this);

        this.showAlrt = false;

        //console.log('TableCall');

        var userEmailDash = null;
        var storedInfoDash = JSON.parse(localStorage.getItem("userinfo"));         
        if (storedInfoDash) {            
                //console.log('Not Undefined or Not Null');       
                //const userNameDash = storedInfoDash[3];
                userEmailDash = storedInfoDash[0];
                console.log(userEmailDash);
        } 

        if(userEmailDash === null){       
            window.location = 'http://127.0.0.1:4100/pages/login';
            //console.log('value not set');
            const userEmailDashRedirect = true;
            this.setState({ userEmailDashRedirect });
        }
            

  
  
    // if (this.state.redirect) {
    //   return <Redirect to='/forms/forms-stock-parameter' />
    // }
      


//http://127.0.0.1:4100/tables/extended-table         

//[{"id": 0, "market_name": "Refined Plastic Pants2", "company_name": "Good", "price": "1577.61", "satisfaction": "5", "inStockDate":""}]

        this.headerCheckboxRef = React.createRef();
    }

    componentDidMount() {

            //const userNameDash = null;
            //console.log("callback");
            

             //console.log(_.times(INITIAL_PRODUCTS_COUNT, generateRow));
        axios.get('http://127.0.0.1:3005/stockParameterRead')
              .then(res => {
                const stockparam = res.data;
                this.setState({ stockparam });
                console.log(res.data[0]);
              })
        
//products: [{id:0,name:'hat',quality:'good',price:'17',satisfaction:'ok',inStockDate:'Tue Jul 23 2019 08:51:11 GMT+0600 (Bangladesh Standard Time)'},{id:1,name:'hat2',quality:'good',price:'17',satisfaction:'ok',inStockDate:'Tue Jul 23 2019 08:51:11 GMT+0600 (Bangladesh Standard Time)'}]),
// {id: 1, market_name: "NASDAQ", company_name: "ABDC", company_name_text: "ABDC", href: "/stocks/NASDAQ/ABDC/", …}
// title: "Alcentra Capital"
// rating: "N/A"
// pricetarget: "N/A"
// created_at: "0000-00-00"
// updated_at: "0000-00-00"

  
        }

    handleSelect(row, isSelected) {
        if (isSelected) {
            this.setState({ selected: [...this.state.selected, row.id] })
        } else {
            this.setState({
                selected: this.state.selected.filter(itemId => itemId !== row.id)
            })
        }
    }

    handleEditRow(row) {

        
        this.setState({
            redirect_edit:true,
            edit_id:row
        })

        //console.log({this.state.edit_id});



        // if (isSelected) {
        //     this.setState({ selected: [...this.state.selected, row.id] })
        // } else {
        //     this.setState({
        //         selected: this.state.selected.filter(itemId => itemId !== row.id)
        //     })
        // }

        console.log(row);
        //console.log(row);
        // if (isSelected) {
        //     this.setState({ selected: [...this.state.selected, row.id] })
        // } else {
        //     this.setState({
        //         selected: this.state.selected.filter(itemId => itemId !== row.id)
        //     })
        // }
    }


    handleDeleteRow(row) {

        
        swal({
          title: "Are you sure?",
          text: "Are you sure that you want to Delete this Parameter Row?",
          icon: "warning",
          dangerMode: true,
          buttons: [true, "Delete!"],
        })
        .then(willDelete => {
          if (willDelete) {
            swal("Deleted!", "Your Parameter has been deleted!", "success");

            var eid = row;
            //console.log(_.times(INITIAL_PRODUCTS_COUNT, generateRow));
            axios.delete('http://127.0.0.1:3005/stockParameterDelete/'+eid)
                  .then(res => {
                   console.log(res);
                  })
            console.log(eid); 

            axios.get('http://127.0.0.1:3005/stockParameterRead')
              .then(res => {
                const stockparam = res.data;
                this.setState({ stockparam });
                console.log(res.data[0]);
              })
            //window.location = 'http://127.0.0.1:4100/tables/stock-market';
            window.location.reload();

            // this.setState({
            //     //redirect_stocktable:true
            //    stockparam: []
            // })

            // $state.reload()
            // $state.forceReload();
            //$state.go($state.current, $stateParams, {reload: true, inherit: false});
            //$scope.reloadstat = function () { $state.go($state.current, {}, {reload: true}); };
            //$state.reload($state.current.name);


          }

        });  



        



        // this.setState({
        //     redirect_edit:true,
        //     edit_id:row
        // })

        //console.log({this.state.edit_id});



        // if (isSelected) {
        //     this.setState({ selected: [...this.state.selected, row.id] })
        // } else {
        //     this.setState({
        //         selected: this.state.selected.filter(itemId => itemId !== row.id)
        //     })
        // }

        //console.log(row);

        //console.log(row);
        // if (isSelected) {
        //     this.setState({ selected: [...this.state.selected, row.id] })
        // } else {
        //     this.setState({
        //         selected: this.state.selected.filter(itemId => itemId !== row.id)
        //     })
        // }

    }


    handleSelectAll(isSelected, rows) {
        if (isSelected) {
            this.setState({ selected: _.map(rows, 'id') })
        } else {
            this.setState({ selected: [] });
        }
    }

   

    handleAddRow() {

        //window.location = 'http://127.0.0.1:4100/forms/forms-stock-parameter';
        //return <Redirect to='/forms/forms-stock-parameter' />;
        //sendSubmitSomewhere('http://127.0.0.1:4100/forms/forms-stock-parameter');
        
        //return <Redirect to="/forms/forms-stock-parameter" />

        // e.preventDefault();
        // this.props.history.push('/forms/forms-stock-parameter');

        this.setState({
          redirect: true
        })
       

        //console.log('testalr');
        const currentSize = this.state.products.length;

        this.setState({
            products: [
                generateRow(currentSize + 1),
                ...this.state.products,
            ]
        });



        //console.log(this.state.products);
    }

    

    handleResetFilters() {
        this.nameFilter('');
        this.qualityFilter('');
        this.priceFilter('');
        this.satisfactionFilter('');
    }

    setSweet(props){
        console.log('tt');
        this.showAlrt=true;
       
        // this.setState({
        //     show:true
        // })

    }

    createColumnDefinitions(props) {
        return [{
            dataField: 'id',
            text: 'ID',
            headerFormatter: column => (
                <React.Fragment>
                    <span className="text-nowrap">{ column.text }</span>
                    <a
                        href="javascript:;"
                        className="d-block small text-decoration-none text-nowrap"
                        onClick={ this.handleResetFilters.bind(this) }
                    >
                        Reset Filters <i className="fa fa-times fa-fw text-danger"></i>
                    </a>
                </React.Fragment>
            ),
            formatter: (cell) => (
                <span className="text-inverse">
                    { cell }
                </span>
            )
        }, {
            dataField: 'market_symbol',
            text: 'Market Symbol',
            sort: true,
            sortCaret,
            formatter: (cell) => (
                <span className="text-inverse">
                    { cell }
                </span>
            ),
            ...buildCustomTextFilter({
                placeholder: 'Enter market name...',
                getFilter: filter => { this.nameFilter = filter; }
            })
        }, {
            dataField: 'company_symbol',
            text: 'Company Symbol',
            sort: true,
            sortCaret,
            formatter: (cell) => (
                <span className="text-inverse">
                    { cell }
                </span>
            )
        }, {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => {
                let pqProps;
                switch (cell) {
                    case StockParamStatus.Enabled:
                        pqProps = {
                            color: 'success',
                            text: 'Enabled'
                        }
                    break;
                    case StockParamStatus.Disabled:
                        pqProps = {
                            color: 'danger',
                            text: 'Disabled'
                        }
                    break;
                    case StockParamStatus.Unknown:
                    default:
                        pqProps = {
                            color: 'secondary',
                            text: 'Unknown'
                        }
                }

                return (
                    <Badge color={pqProps.color}>
                        { pqProps.text }
                    </Badge>
                )
            },
            sort: true,
            sortCaret,
            ...buildCustomSelectFilter({
                placeholder: 'Select Quality',
                options: [
                    { value: StockParamStatus.Enabled, label: 'Enabled' },
                    { value: StockParamStatus.Disabled, label: 'Disabled' },
                    { value: StockParamStatus.Unknown, label: 'Unknown' }
                ],
                getFilter: filter => { this.qualityFilter = filter; }
            })
        },{
            dataField: 'edit_id',
            text: 'Action',            
            formatter: (cell) => (
                <span className="text-inverse">
                    <td className="align-middle text-right">
                        <ButtonGroup>
                            <a href="javascript:;" onClick={() => this.handleEditRow(cell)} color="link" className="text-decoration-none">
                                <i className="fa fa-clone"></i>
                            </a>
                            
                            <Button href="javascript:;" onClick={() => this.handleDeleteRow(cell)} color="link" className="text-decoration-none">
                                <i className="fa fa-close"></i>
                            </Button>
                        </ButtonGroup>
                    </td>
                </span>
            )
        }]; 
    }

    render() {

        if (this.state.redirect === true) {
          return <Redirect to='/forms/forms-stock-parameter' />
        }

        

        if (this.state.redirect_edit === true){
            console.log(this.state.edit_id);
            return <Redirect to={'/forms/forms-stock-parameter-edit/'+this.state.edit_id} />
        }

        if (this.state.userEmailDashRedirect === true){
            //console.log(this.state.edit_id);
            //console.log(this.state.userEmailDashRedirect);
            return <Redirect to={"/pages/login"} />
        }

        // if (this.state.redirect_stocktable === true){
           
        //     return <Redirect to={'/tables/stock-market'} />
        // }


    


        


        this.state = {
            products: this.state.stockparam
        };

        const columnDefs = this.createColumnDefinitions();
        const paginationDef = paginationFactory({
            paginationSize: 5,
            showTotal: true,
            pageListRenderer: (props) => (
                <CustomPaginationPanel { ...props } size="sm" className="ml-md-auto mt-2 mt-md-0" />
            ),
            sizePerPageRenderer: (props) => (
                <CustomSizePerPageButton { ...props } />
            ),
            paginationTotalRenderer: (from, to, size) => (
                <CustomPaginationTotal { ...{ from, to, size } } />
            )
        });
        const selectRowConfig = {
            mode: 'checkbox',
            selected: this.state.selected,
            onSelect: this.handleSelect.bind(this),
            onSelectAll: this.handleSelectAll.bind(this),
            selectionRenderer: ({ mode, checked, disabled }) => (
                <CustomInput type={ mode } checked={ checked } disabled={ disabled } />
            ),
            selectionHeaderRenderer: ({ mode, checked, indeterminate }) => (
                <CustomInput type={ mode } checked={ checked } innerRef={el => el && (el.indeterminate = indeterminate)} />
            )
        };

        return (
            <ToolkitProvider
                keyField="id"
                data={ this.state.products }
                columns={ columnDefs }
                search
                exportCSV
            >
            {
                props => (
                    <React.Fragment>
                        <div className="d-flex mb-2 md-8">
                            <h6 className="my-0">
                                <div className="d-flex ml-auto">
                                
                                <ButtonGroup>
                                    <Button
                                        size="sm"
                                        outline
                                        onClick={ this.handleAddRow.bind(this) }
                                    >
                                        <i className="fa fa-fw fa-plus">Add New</i>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Button>
                                    <CustomExportCSV
                                        { ...props.csvProps }
                                    >
                                        Export
                                    </CustomExportCSV>
                                    
                                    
                                </ButtonGroup>
                                
                            </div>
                            </h6>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="d-flex ml-center">
                            <CustomSearch
                                    className="mr-2"
                                    { ...props.searchProps }
                                />
                            </div>

                            
                        </div>
                        <BootstrapTable
                            classes="table-responsive"
                            pagination={ paginationDef }
                            filter={ filterFactory() }
                            selectRow={ selectRowConfig }
                            bordered={ false }
                            responsive
                            { ...props.baseProps }
                        />
                    </React.Fragment>
                )
            }
            </ToolkitProvider>

        );
    }
}