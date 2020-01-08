import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import axios from "axios";
import swal from 'sweetalert';
import { Container,Row,Col,Card,CardTitle,CardBody,Button} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { HeaderDemo } from "../../components/HeaderDemo";
//import CSVReader from 'react-csv-reader';
//import CsvParse from '@vtex/react-csv-parse'
//import rp from "request-promise";
//import cheerio from "cheerio";


class Scraping extends Component {

constructor(props) {
        super(props)
        this.state = {
          data: [],
          scrapStateMsg: "Scraping not initialize...",
          scrapStateDoneMsg:'Click on Start button to initialize/start scrapping',
          loading: false
        }
}

// handleData = data => {
//     //console.log(data);
//     this.setState({ data })

//     // //if(event.target.elements.form_flag.value === "csv_paeameter_upload"){
//     // const stock_param_data_csv = data;

//     // axios.post('http://127.0.0.1:3005/api/stockParameterInsertCsv', stock_param_data_csv)
//     // .then(res => {           
//     // //this.setState({ stock_param_data_csv });
//     // //console.log(res);
//     // //console.log(res.data.affectedRows);
//     // //console.log(res.data.warningCount);
//     // //this.setState({ message: "Total Inserted: "+res.data.affectedRows+" & Duplicate: "+res.data.warningCount });
//     // this.setState({ totalInsert:res.data.affectedRows  });
//     // this.setState({ totalDuplicate:res.data.warningCount  });
//     // //swal("Inserted: "+res.data.affectedRows+"& Duplicate:"+res.data.warningCount);

//     // // swal({
//     // //   icon: 'error',
//     // //   title: 'Oops...',
//     // //   text: 'Something went wrong!',
//     // //   footer: '<a href>Why do I have this issue?</a>'
//     // // })

//     // // affectedRows - Insert
//     // // warningCount - Duplicate
//     // // changedRows

//     // });
//     // //window.location = 'http://127.0.0.1:4100/tables/stock-market'; 

//     // event.preventDefault();
//     // //}
//     // //########  Stock Parameter Add Form End  ##########


// }


 


handleScrapping(e) {
    
    //console.log(data);
    //alert('data');
    

    //if(event.target.elements.form_flag.value === "csv_paeameter_upload"){
    //const stock_param_data_csv = this.state.data;

    // axios.post('http://127.0.0.1:3005/scraper', stock_param_data_csv)
    // .then(res => {           
    // //this.setState({ stock_param_data_csv });
    // //console.log(res);
    // //console.log(res.data.affectedRows);
    // //console.log(res.data.warningCount);
    // //this.setState({ message: "Total Inserted: "+res.data.affectedRows+" & Duplicate: "+res.data.warningCount });
    // this.setState({ totalInsert:res.data.affectedRows  });
    // this.setState({ totalDuplicate:res.data.warningCount  });
    // //swal("Inserted: "+res.data.affectedRows+"& Duplicate:"+res.data.warningCount);



    //console.log(_.times(INITIAL_PRODUCTS_COUNT, generateRow));
    // axios.get('http://127.0.0.1:3005/scraper')
    //     .then(res => {
    //     const stockparam = res;
    //     //this.setState({ stockparam });
    //     console.log(stockparam);
    // })

    this.setState({ loading: true }, () => {
     
      axios.get('http://127.0.0.1:3005/scraper')
      .then(res => {

        this.setState({loading: false,});   //data: [...result.data],
        const stockparam = res;
        //this.setState({ stockparam });
        console.log(stockparam);

      })
        

    });




    // swal({
    //   icon: 'success',
    //   title: '!',
    //   text: 'Successfully Uploaded!',
    //   footer: '<a href>Go here to see uploaded data</a>'
    // })

    // affectedRows - Insert
    // warningCount - Duplicate
    // changedRows

    //});
    //window.location = 'http://127.0.0.1:4100/tables/stock-market'; 

    event.preventDefault();
    //}
    //########  Stock Parameter Add Form End  ##########


}


render() {
    const keys = [
    "company_symbol",
    "market_symbol",
    ];

    const loading = this.state.loading;

    //console.log(this.state.data);


    return (
            <React.Fragment>
        <Container><Row> 
        <HeaderMain 
                title="Scrap From Site"
                className="mb-5 mt-4"
            />
                
            </Row>
            { /* END Header 1 */}
            { /* START Section 1 */}
            <Row>
                <Col lg={ 6 }>
                    <Card className="mb-3">
                        <CardBody>
                            
                            { /* START FormStockParam */}                            
                           
    <button type="button" name="Start" onClick={e => this.handleScrapping(e)}>Start</button><br/><br/>
    <span ><b>{this.state.scrapStateMsg}</b> <b>{this.state.scrapStateDoneMsg}</b> </span>

    {loading ? 'Scrapping...please wait!' : ''}

                            { /* END Form */}
                        </CardBody>
                    </Card>
                    
                </Col>
                
            </Row>
            { /* END Section 1 */}

        </Container>
    </React.Fragment>

        )
    }
}

export default Scraping;