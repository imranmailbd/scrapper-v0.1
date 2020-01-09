import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import axios from "axios";
import swal from 'sweetalert';
import { Container,Row,Col,Card,CardTitle,CardBody,Button} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { HeaderDemo } from "../../components/HeaderDemo";
//import CSVReader from 'react-csv-reader';
import CsvParse from '@vtex/react-csv-parse'


class FormCsvUpload extends Component {

constructor(props) {
        super(props)
        this.state = {
          data: [],
          errordata: [],
          totalInsert: "Nothing till inserted...",
          totalDuplicate:'N/A'
        }
}

handleData = data => {
    //console.log(data);
    this.setState({ data })

    // //if(event.target.elements.form_flag.value === "csv_paeameter_upload"){
    // const stock_param_data_csv = data;

    // axios.post('http://127.0.0.1:3005/api/stockParameterInsertCsv', stock_param_data_csv)
    // .then(res => {           
    // //this.setState({ stock_param_data_csv });
    // //console.log(res);
    // //console.log(res.data.affectedRows);
    // //console.log(res.data.warningCount);
    // //this.setState({ message: "Total Inserted: "+res.data.affectedRows+" & Duplicate: "+res.data.warningCount });
    // this.setState({ totalInsert:res.data.affectedRows  });
    // this.setState({ totalDuplicate:res.data.warningCount  });
    // //swal("Inserted: "+res.data.affectedRows+"& Duplicate:"+res.data.warningCount);

    // // swal({
    // //   icon: 'error',
    // //   title: 'Oops...',
    // //   text: 'Something went wrong!',
    // //   footer: '<a href>Why do I have this issue?</a>'
    // // })

    // // affectedRows - Insert
    // // warningCount - Duplicate
    // // changedRows

    // });
    // //window.location = 'http://127.0.0.1:4100/tables/stock-market'; 

    // event.preventDefault();
    // //}
    // //########  Stock Parameter Add Form End  ##########


}





handleError = errordata => {
    //console.log(data);
    this.setState({ errordata })

    // //if(event.target.elements.form_flag.value === "csv_paeameter_upload"){
    // const stock_param_data_csv = data;

    // axios.post('http://127.0.0.1:3005/api/stockParameterInsertCsv', stock_param_data_csv)
    // .then(res => {           
    // //this.setState({ stock_param_data_csv });
    // //console.log(res);
    // //console.log(res.data.affectedRows);
    // //console.log(res.data.warningCount);
    // //this.setState({ message: "Total Inserted: "+res.data.affectedRows+" & Duplicate: "+res.data.warningCount });
    // this.setState({ totalInsert:res.data.affectedRows  });
    // this.setState({ totalDuplicate:res.data.warningCount  });
    // //swal("Inserted: "+res.data.affectedRows+"& Duplicate:"+res.data.warningCount);

    // // swal({
    // //   icon: 'error',
    // //   title: 'Oops...',
    // //   text: 'Something went wrong!',
    // //   footer: '<a href>Why do I have this issue?</a>'
    // // })

    // // affectedRows - Insert
    // // warningCount - Duplicate
    // // changedRows

    // });
    // //window.location = 'http://127.0.0.1:4100/tables/stock-market'; 

    // event.preventDefault();
    // //}
    // //########  Stock Parameter Add Form End  ##########


}



handleInsert(e) {
    
    //console.log(data);
    

    //if(event.target.elements.form_flag.value === "csv_paeameter_upload"){
    const stock_param_data_csv = this.state.data;

    axios.post('http://127.0.0.1:3005/api/stockParameterInsertCsv', stock_param_data_csv)
    .then(res => {           
    //this.setState({ stock_param_data_csv });
    //console.log(res);
    //console.log(res.data.affectedRows);
    //console.log(res.data.warningCount);
    //this.setState({ message: "Total Inserted: "+res.data.affectedRows+" & Duplicate: "+res.data.warningCount });
    this.setState({ totalInsert:res.data.affectedRows  });
    this.setState({ totalDuplicate:res.data.warningCount  });
    //swal("Inserted: "+res.data.affectedRows+"& Duplicate:"+res.data.warningCount);

    swal({
      icon: 'success',
      title: '!',
      text: 'Successfully Uploaded!',
      footer: '<a href>Go here to see uploaded data</a>'
    })

    // affectedRows - Insert
    // warningCount - Duplicate
    // changedRows

    });
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

    console.log(this.state.data);


    return (
            <React.Fragment>
        <Container><Row> 
        <HeaderMain 
                title="Upload Stock List"
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
                            
                            <CsvParse
      keys={keys}
      onDataUploaded={this.handleData}
      onError={this.handleError}
      render={onChange => <input type="file" onChange={onChange} />}
    /><br/><br/>
    <button type="button" name="submit" onClick={e => this.handleInsert(e)}>Upload</button><br/><br/>
    <span >Total Inserted: <b>{this.state.totalInsert}</b> && Total Duplicates Data Found On Your File <b>{this.state.totalDuplicate}</b> </span>
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

export default FormCsvUpload;